import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamMember, TeamMemberDocument } from './schemas/team-member.schema';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FilterTeamDto } from './dto/filter-team.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(TeamMember.name)
    private teamMemberModel: Model<TeamMemberDocument>,
  ) {}

  async create(createDto: CreateTeamMemberDto): Promise<TeamMemberDocument> {
    const teamMember = new this.teamMemberModel(createDto);
    return teamMember.save();
  }

  async findAll(
    filterDto: FilterTeamDto,
    includeInactive = false,
  ): Promise<PaginatedResponseDto<TeamMemberDocument>> {
    const { page = 1, limit = 20, department, showOnHome, isActive } = filterDto;

    // Build query
    const query: any = {};

    if (!includeInactive) {
      query.isActive = true;
    } else if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (department) {
      query.department = department;
    }

    if (showOnHome !== undefined) {
      query.showOnHome = showOnHome;
    }

    const total = await this.teamMemberModel.countDocuments(query).exec();

    const members = await this.teamMemberModel
      .find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(members, total, page, limit);
  }

  async findForHomepage(): Promise<TeamMemberDocument[]> {
    return this.teamMemberModel
      .find({ isActive: true, showOnHome: true })
      .sort({ sortOrder: 1 })
      .limit(8)
      .exec();
  }

  async findByDepartment(department: string): Promise<TeamMemberDocument[]> {
    return this.teamMemberModel
      .find({ department, isActive: true })
      .sort({ sortOrder: 1 })
      .exec();
  }

  async findOne(id: string): Promise<TeamMemberDocument> {
    const member = await this.teamMemberModel.findById(id).exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    return member;
  }

  async update(
    id: string,
    updateDto: UpdateTeamMemberDto,
  ): Promise<TeamMemberDocument> {
    const member = await this.teamMemberModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    return member;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teamMemberModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Team member not found');
    }
  }

  async getStats(): Promise<any> {
    const [total, active, byDepartment] = await Promise.all([
      this.teamMemberModel.countDocuments().exec(),
      this.teamMemberModel.countDocuments({ isActive: true }).exec(),
      this.teamMemberModel
        .aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .exec(),
    ]);

    return {
      total,
      active,
      byDepartment: byDepartment.reduce(
        (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
        {},
      ),
    };
  }

  async updateSortOrder(
    members: { id: string; sortOrder: number }[],
  ): Promise<void> {
    const bulkOps = members.map((member) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(member.id) },
        update: { $set: { sortOrder: member.sortOrder } },
      },
    }));

    await this.teamMemberModel.bulkWrite(bulkOps);
  }
}

