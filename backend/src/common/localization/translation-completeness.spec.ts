import { getMissingEnglishFields } from './translation-completeness';

describe('translation completeness', () => {
  it('reports public Project companion fields and SEO keyword indexes', () => {
    const missing = getMissingEnglishFields('project', {
      titleEn: 'Project',
      summaryEn: 'Summary',
      challengeEn: 'Challenge',
      solutionEn: 'Solution',
      clientName: 'العميل',
      industry: 'التعليم',
      duration: 'ثلاثة أشهر',
      seo: {
        metaTitleEn: 'Project',
        metaDescriptionEn: 'Project description',
        keywords: ['تقنية', 'تعليم'],
        keywordsEn: ['technology'],
      },
    });

    expect(missing).toEqual([
      'clientNameEn',
      'industryEn',
      'durationEn',
      'seo.keywordsEn[1]',
    ]);
  });

  it('reports Blog CTA and optional social SEO companions', () => {
    const missing = getMissingEnglishFields('blog', {
      titleEn: 'Article',
      excerptEn: 'Excerpt',
      contentEn: 'Content',
      categoryEn: 'Engineering',
      ctaTitle: 'ابدأ مشروعك',
      ctaDescription: 'تواصل معنا',
      ctaButtonText: 'ابدأ الآن',
      seo: {
        metaTitleEn: 'Article',
        metaDescriptionEn: 'Article description',
        keywords: ['برمجة'],
        ogTitle: 'عنوان المشاركة',
        ogDescription: 'وصف المشاركة',
        twitterTitle: 'عنوان تويتر',
        twitterDescription: 'وصف تويتر',
      },
    });

    expect(missing).toEqual([
      'ctaTitleEn',
      'ctaDescriptionEn',
      'ctaButtonTextEn',
      'seo.keywordsEn[0]',
      'seo.ogTitleEn',
      'seo.ogDescriptionEn',
      'seo.twitterTitleEn',
      'seo.twitterDescriptionEn',
    ]);
  });

  it('covers every public nested About companion', () => {
    const missing = getMissingEnglishFields('about', {
      hero: {
        titleEn: 'About us',
        subtitleEn: 'Our story',
        badge: 'من نحن',
        primaryButtonText: 'تواصل معنا',
        secondaryButtonText: 'أعمالنا',
        trustBadges: ['خبرة', 'جودة'],
        trustBadgesEn: ['Experience'],
      },
      visionEn: 'Vision',
      missionEn: 'Mission',
      approachEn: 'Approach',
      story: {
        title: 'قصتنا',
        description: 'الوصف',
        painPoints: ['التعقيد', 'التأخير'],
        painPointsEn: ['Complexity'],
        closingStatement: 'الخلاصة',
      },
      thinking: [
        { titleEn: 'Think', descriptionEn: 'Description', result: 'النتيجة' },
      ],
      differentiators: [
        { titleEn: 'Difference', descriptionEn: 'Description', badge: 'أفضل' },
      ],
      process: [
        {
          titleEn: 'Process',
          descriptionEn: 'Description',
          deliverable: 'خطة',
        },
      ],
      values: [
        { titleEn: 'Value', descriptionEn: 'Description', example: 'مثال' },
      ],
      stats: [
        {
          labelEn: 'Projects',
          suffix: 'مشروع',
          description: 'تم التسليم',
        },
      ],
      teamNote: {
        title: 'فريقنا',
        description: 'وصف الفريق',
        highlights: ['خبرة', 'تعاون'],
        highlightsEn: ['Experience'],
      },
      cta: {
        titleEn: 'Start',
        descriptionEn: 'Contact us',
        buttonTextEn: 'Contact',
        secondaryButtonText: 'المشاريع',
      },
      seo: {
        metaTitleEn: 'About',
        metaDescriptionEn: 'About Smart Agency',
        keywords: ['وكالة'],
      },
    });

    expect(missing).toEqual([
      'hero.badgeEn',
      'hero.primaryButtonTextEn',
      'hero.secondaryButtonTextEn',
      'hero.trustBadgesEn[1]',
      'story.titleEn',
      'story.descriptionEn',
      'story.closingStatementEn',
      'story.painPointsEn[1]',
      'thinking.0.resultEn',
      'differentiators.0.badgeEn',
      'process.0.deliverableEn',
      'values.0.exampleEn',
      'stats.0.descriptionEn',
      'stats.0.suffixEn',
      'teamNote.titleEn',
      'teamNote.descriptionEn',
      'teamNote.highlightsEn[1]',
      'cta.secondaryButtonTextEn',
      'seo.keywordsEn[0]',
    ]);
  });
});
