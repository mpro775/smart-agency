import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'node:crypto';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  Certificate,
  CertificateStatus,
  CertificateType,
} from './schemas/certificate.schema';
import { Trainee } from '../trainees/schemas/trainee.schema';
import { TraineesService } from '../trainees/trainees.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { FilterCertificatesDto } from './dto/filter-certificates.dto';
import { VerificationUrlService } from './verification-url.service';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import {
  credentialError,
  credentialNotFound,
  literalSearch,
  objectId,
} from '../common/utils/credential.utils';

const typeCodes: Record<CertificateType, string> = {
  internship: 'INT',
  practical_training: 'PTR',
  experience: 'EXP',
  course_completion: 'CRS',
};
const publicIdPattern =
  /^SA-(INT|PTR|EXP|CRS)-[A-Z0-9]{2,8}-\d{4}-[A-F0-9]{8,10}$/;

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name) private readonly model: Model<Certificate>,
    @InjectModel(Trainee.name) private readonly traineeModel: Model<Trainee>,
    private readonly trainees: TraineesService,
    private readonly urls: VerificationUrlService,
  ) {}

  private adminResponse(certificate: Certificate & { _id: Types.ObjectId }) {
    return {
      ...certificate,
      verificationUrl: this.urls.forCertificate(certificate.certificateId),
    };
  }
  private validateFacts(
    dto: Pick<Certificate, 'trainingStartDate' | 'trainingEndDate'> &
      Partial<Pick<Certificate, 'certificateImage' | 'certificatePdf'>>,
  ) {
    if (
      !Number.isFinite(new Date(dto.trainingStartDate).getTime()) ||
      !Number.isFinite(new Date(dto.trainingEndDate).getTime()) ||
      new Date(dto.trainingEndDate) < new Date(dto.trainingStartDate)
    )
      credentialError(
        'INVALID_TRAINING_DATE_RANGE',
        'Training end date must be on or after the start date',
      );
    if (
      dto.certificateImage &&
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
      ].includes(dto.certificateImage.mimeType)
    )
      credentialError(
        'INVALID_IMAGE',
        'Certificate image must be a supported image',
      );
    if (
      dto.certificatePdf &&
      (dto.certificatePdf.mimeType !== 'application/pdf' ||
        !/^[a-f0-9]{64}$/.test(dto.certificatePdf.sha256 || ''))
    )
      credentialError(
        'INVALID_PDF',
        'A PDF with a SHA-256 fingerprint is required',
      );
  }
  async create(dto: CreateCertificateDto, actor: string) {
    await this.trainees.findOne(dto.traineeId);
    this.validateFacts({
      ...dto,
      trainingStartDate: new Date(dto.trainingStartDate),
      trainingEndDate: new Date(dto.trainingEndDate),
      certificateImage: dto.certificateImage ?? undefined,
      certificatePdf: dto.certificatePdf ?? undefined,
    });
    if (dto.supersedesCertificateId) {
      const previous = await this.model
        .findOne({
          certificateId: dto.supersedesCertificateId,
          status: CertificateStatus.REVOKED,
          traineeId: dto.traineeId,
        })
        .exec();
      if (!previous || previous.supersededByCertificateId)
        credentialError(
          'INVALID_SUPERSEDED_CERTIFICATE',
          'Select a revoked certificate belonging to this trainee without an issued replacement',
        );
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      const certificateId = `SA-${typeCodes[dto.type]}-${dto.programCode}-${new Date().getUTCFullYear()}-${randomBytes(5).toString('hex').toUpperCase()}`;
      try {
        const certificate = await this.model.create({
          ...dto,
          certificateId,
          status: CertificateStatus.DRAFT,
          revision: 1,
          createdBy: objectId(actor, 'USER_NOT_FOUND'),
          events: [{ action: 'created', actorId: actor, at: new Date() }],
        });
        return this.adminResponse(certificate.toObject());
      } catch (error) {
        if (
          !(
            error &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === 11000
          )
        )
          throw error;
      }
    }
    throw new ConflictException({
      code: 'CERTIFICATE_ID_COLLISION',
      message: 'Could not allocate a certificate ID; please retry',
    });
  }
  async findAll(dto: FilterCertificatesDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      type,
      traineeId,
      from,
      until,
    } = dto;
    const query: FilterQuery<Certificate> = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (traineeId) query.traineeId = traineeId;
    if (from || until) {
      if (from && until && new Date(from) > new Date(until))
        credentialError('INVALID_DATE_RANGE', 'Filter end must follow start');
      query.createdAt = {
        ...(from ? { $gte: new Date(from) } : {}),
        ...(until
          ? {
              $lte: new Date(
                until.length === 10 ? `${until}T23:59:59.999Z` : until,
              ),
            }
          : {}),
      };
    }
    if (search) {
      const regex = literalSearch(search);
      const trainees = await this.traineeModel
        .find({ $or: [{ fullName: regex }, { fullNameEn: regex }] })
        .select('_id')
        .lean()
        .exec();
      query.$or = [
        { certificateId: regex },
        { specialization: regex },
        { specializationEn: regex },
        { 'holderSnapshot.fullName': regex },
        { 'holderSnapshot.fullNameEn': regex },
        { traineeId: { $in: trainees.map((t) => t._id) } },
      ];
    }
    const [items, total] = await Promise.all([
      this.model
        .find(query)
        .populate('traineeId', 'fullName fullNameEn photo.url')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.model.countDocuments(query),
    ]);
    return new PaginatedResponseDto(
      items.map((item) => this.adminResponse(item)),
      total,
      page,
      limit,
    );
  }
  private async record(id: string) {
    const certificate = await this.model
      .findById(objectId(id, 'CERTIFICATE_NOT_FOUND'))
      .exec();
    if (!certificate)
      credentialNotFound('CERTIFICATE_NOT_FOUND', 'Certificate not found');
    return certificate;
  }
  async findOne(id: string) {
    const certificate = await this.record(id);
    return this.adminResponse(certificate.toObject());
  }
  private async mutate(
    current: Awaited<ReturnType<CertificatesService['record']>>,
    changes: Record<string, unknown>,
    action: string,
    actor: string,
    note?: string,
  ) {
    const certificate = await this.model
      .findOneAndUpdate(
        {
          _id: current._id,
          revision: current.revision,
          status: current.status,
        },
        {
          $set: { ...changes, updatedBy: objectId(actor, 'USER_NOT_FOUND') },
          $inc: { revision: 1 },
          $push: {
            events: {
              action,
              actorId: actor,
              at: new Date(),
              ...(note ? { note } : {}),
            },
          },
        },
        { new: true, runValidators: true },
      )
      .exec();
    if (!certificate)
      throw new ConflictException({
        code: 'CERTIFICATE_CONCURRENT_UPDATE',
        message: 'Certificate changed; reload before continuing',
      });
    return this.adminResponse(certificate.toObject());
  }
  async update(id: string, dto: UpdateCertificateDto, actor: string) {
    const current = await this.record(id);
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );
    const fields = Object.keys(changes);
    if (
      current.status !== CertificateStatus.DRAFT &&
      fields.some(
        (key) =>
          !['publicPhotoVisible', 'publicProfessionalLinksVisible'].includes(
            key,
          ),
      )
    )
      credentialError(
        'CERTIFICATE_IMMUTABLE_AFTER_ISSUE',
        'Issued credentials only allow privacy updates. Revoke and create a replacement for corrections.',
      );
    if (dto.traineeId) {
      if (
        current.supersedesCertificateId &&
        dto.traineeId !== current.traineeId.toString()
      )
        credentialError(
          'INVALID_SUPERSEDED_CERTIFICATE',
          'A replacement must keep the original trainee',
        );
      await this.trainees.findOne(dto.traineeId);
    }
    this.validateFacts({
      ...current.toObject(),
      ...dto,
      trainingStartDate: new Date(
        dto.trainingStartDate || current.trainingStartDate,
      ),
      trainingEndDate: new Date(dto.trainingEndDate || current.trainingEndDate),
      certificateImage:
        dto.certificateImage === undefined
          ? current.certificateImage
          : (dto.certificateImage ?? undefined),
      certificatePdf:
        dto.certificatePdf === undefined
          ? current.certificatePdf
          : (dto.certificatePdf ?? undefined),
    });
    return this.mutate(current, changes, 'updated', actor);
  }
  async issue(id: string, actor: string) {
    const current = await this.record(id);
    if (current.status !== CertificateStatus.DRAFT)
      credentialError(
        'CERTIFICATE_NOT_DRAFT',
        'Only draft certificates can be issued',
      );
    const trainee = await this.trainees.findOne(current.traineeId.toString());
    this.validateFacts(current);
    const missing = [
      !trainee.isActive && 'active trainee',
      !trainee.fullName?.trim() && 'Arabic holder name',
      !trainee.fullNameEn?.trim() && 'English holder name',
      ...(
        [
          'title',
          'titleEn',
          'specialization',
          'specializationEn',
          'supervisorName',
          'supervisorTitle',
        ] as const
      ).map((key) => !current[key]?.trim() && key),
      !current.certificateImage?.url && 'certificate image',
      !current.certificatePdf?.url && 'certificate PDF',
      !current.certificatePdf?.sha256 && 'PDF SHA-256',
    ].filter(Boolean);
    if (missing.length)
      credentialError(
        'CERTIFICATE_ISSUE_REQUIREMENTS_INCOMPLETE',
        `Missing: ${missing.join(', ')}`,
      );
    // Claim the predecessor atomically so concurrent replacement drafts cannot both issue.
    if (current.supersedesCertificateId) {
      const previous = await this.model
        .findOneAndUpdate(
          {
            certificateId: current.supersedesCertificateId,
            traineeId: current.traineeId,
            status: CertificateStatus.REVOKED,
            $or: [
              { supersededByCertificateId: { $exists: false } },
              { supersededByCertificateId: current.certificateId },
            ],
          },
          { $set: { supersededByCertificateId: current.certificateId } },
        )
        .exec();
      if (!previous)
        credentialError(
          'INVALID_SUPERSEDED_CERTIFICATE',
          'The revoked credential already has a replacement',
        );
    }
    return this.mutate(
      current,
      {
        status: CertificateStatus.ACTIVE,
        issuedAt: new Date(),
        issuedBy: objectId(actor, 'USER_NOT_FOUND'),
        holderSnapshot: {
          fullName: trainee.fullName,
          fullNameEn: trainee.fullNameEn,
          photo: trainee.photo,
          linkedinUrl: trainee.linkedinUrl,
          githubUrl: trainee.githubUrl,
          portfolioUrl: trainee.portfolioUrl,
        },
      },
      'issued',
      actor,
    );
  }
  async revoke(id: string, reason: string, actor: string) {
    const current = await this.record(id);
    if (current.status === CertificateStatus.REVOKED)
      credentialError(
        'CERTIFICATE_ALREADY_REVOKED',
        'Certificate is already revoked',
      );
    if (current.status !== CertificateStatus.ACTIVE)
      credentialError(
        'CERTIFICATE_NOT_ACTIVE',
        'Only active certificates can be revoked',
      );
    return this.mutate(
      current,
      {
        status: CertificateStatus.REVOKED,
        revokedAt: new Date(),
        revokedBy: objectId(actor, 'USER_NOT_FOUND'),
        revokedReason: reason,
      },
      'revoked',
      actor,
      reason,
    );
  }
  async verify(input: string) {
    const certificateId = input.trim().toUpperCase();
    const unavailable = () =>
      credentialNotFound(
        'CERTIFICATE_NOT_FOUND',
        'Certificate not found or not publicly available',
      );
    if (!publicIdPattern.test(certificateId)) unavailable();
    const certificate = await this.model
      .findOne({
        certificateId,
        status: { $in: [CertificateStatus.ACTIVE, CertificateStatus.REVOKED] },
      })
      .lean()
      .exec();
    if (!certificate?.holderSnapshot) return unavailable();
    const snapshot = certificate.holderSnapshot;
    const base = {
      certificateId,
      status: certificate.status,
      authentic: certificate.status === CertificateStatus.ACTIVE,
      verificationUrl: this.urls.forCertificate(certificateId),
      holder: { fullName: snapshot.fullName, fullNameEn: snapshot.fullNameEn },
    };
    if (certificate.status === CertificateStatus.REVOKED)
      return {
        ...base,
        wasIssuedBySmartAgency: true,
        revokedAt: certificate.revokedAt,
        credential: {
          specialization: certificate.specialization,
          specializationEn: certificate.specializationEn,
          issuedAt: certificate.issuedAt,
        },
      };
    const privacy = await this.traineeModel
      .findById(certificate.traineeId)
      .select('publicPhotoAllowed publicProfessionalLinksAllowed')
      .lean()
      .exec();
    return {
      ...base,
      holder: {
        ...base.holder,
        ...(certificate.publicPhotoVisible &&
        privacy?.publicPhotoAllowed &&
        snapshot.photo
          ? { photoUrl: snapshot.photo.url }
          : {}),
      },
      credential: {
        type: certificate.type,
        title: certificate.title,
        titleEn: certificate.titleEn,
        specialization: certificate.specialization,
        specializationEn: certificate.specializationEn,
        trainingStartDate: certificate.trainingStartDate,
        trainingEndDate: certificate.trainingEndDate,
        durationLabel: certificate.durationLabel,
        durationLabelEn: certificate.durationLabelEn,
        skills: (certificate.skills ?? []).map((skill) => ({
          name: skill.name,
          nameEn: skill.nameEn,
        })),
        description: certificate.description,
        descriptionEn: certificate.descriptionEn,
        issuedAt: certificate.issuedAt,
      },
      supervisor: {
        name: certificate.supervisorName,
        nameEn: certificate.supervisorNameEn,
        title: certificate.supervisorTitle,
        titleEn: certificate.supervisorTitleEn,
      },
      issuer: {
        name: 'وكالة سمارت',
        nameEn: 'Smart Agency',
        website: this.urls.siteUrl,
      },
      files: {
        certificateImageUrl: certificate.certificateImage?.url,
        certificatePdfUrl: certificate.certificatePdf?.url,
      },
      ...(certificate.publicProfessionalLinksVisible &&
      privacy?.publicProfessionalLinksAllowed
        ? {
            professionalLinks: {
              linkedinUrl: snapshot.linkedinUrl,
              githubUrl: snapshot.githubUrl,
              portfolioUrl: snapshot.portfolioUrl,
            },
          }
        : {}),
    };
  }
}
