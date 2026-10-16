import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class VerificationUrlService {
  readonly siteUrl: string;
  constructor(config: ConfigService) {
    const candidate =
      config.get<string>('PUBLIC_SITE_URL') ||
      config.get<string>('FRONTEND_URL')?.split(',')[0]?.trim() ||
      'https://smartagency-ye.com';
    try {
      const url = new URL(candidate);
      this.siteUrl = ['http:', 'https:'].includes(url.protocol)
        ? url.origin
        : 'https://smartagency-ye.com';
    } catch {
      this.siteUrl = 'https://smartagency-ye.com';
    }
  }
  forCertificate(id: string) {
    return `${this.siteUrl}/verify/${encodeURIComponent(id)}`;
  }
}
