import { ConfigService } from '@nestjs/config';

const WEAK_JWT_SECRETS = new Set([
  'change-me',
  'default-secret-key',
  'your-secret-key',
  'your-super-secret-jwt-key-change-this-in-production',
]);

export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  if (isProduction && (secret.length < 32 || WEAK_JWT_SECRETS.has(secret))) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters and not a default value in production',
    );
  }

  return secret;
}
