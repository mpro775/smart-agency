import { localizePublicData, resolveLocale } from './locale';

describe('localization', () => {
  it('resolves query language before the header', () => {
    expect(
      resolveLocale({
        query: { lang: 'en' },
        headers: { 'accept-language': 'ar-YE' },
      } as never),
    ).toBe('en');
  });

  it('resolves equivalent English query and Accept-Language requests', () => {
    const queryLocale = resolveLocale({
      query: { lang: 'en' },
      headers: {},
    });
    const headerLocale = resolveLocale({
      query: {},
      headers: { 'accept-language': 'en-US,en;q=0.9' },
    });

    expect(queryLocale).toBe('en');
    expect(headerLocale).toBe(queryLocale);
  });

  it('falls back to Arabic for unsupported locales', () => {
    expect(resolveLocale({ query: { lang: 'fr' }, headers: {} } as never)).toBe(
      'ar',
    );
  });

  it('localizes nested content and removes English companion fields', () => {
    const result = localizePublicData(
      {
        title: 'عنوان',
        titleEn: 'Title',
        nested: { description: 'وصف', descriptionEn: 'Description' },
        items: [{ label: 'تسمية', labelEn: '' }],
      },
      'en',
    );

    expect(result).toEqual({
      title: 'Title',
      nested: { description: 'Description' },
      items: [{ label: 'تسمية' }],
    });
  });
});
