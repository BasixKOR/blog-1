import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export async function getThreadsFollowers() {
  let browser;
  try {
    const options = process.env.AWS_LAMBDA_FUNCTION_VERSION
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
        }
      : {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: true,
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
        };

    browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.threads.net/@hajoeun_', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await Promise.race([
      page.waitForSelector('span[title]', { timeout: 30000 }),
      page.waitForSelector('section', { timeout: 30000 }),
      page.waitForSelector('[role="main"]', { timeout: 30000 }),
    ]);

    // 실제 콘텐츠가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const spans = document.querySelectorAll('span[title]');
        return Array.from(spans).some((span) => /^[\d,]+$/.test(span.getAttribute('title') || ''));
      },
      { timeout: 30000 }
    );

    const spans = await page.$$('span[title]');

    for (const span of spans) {
      const title = await span.evaluate((el) => el.getAttribute('title'));
      if (title && /^[\d,]+$/.test(title)) {
        return parseInt(title.replace(/,/g, ''));
      }
    }

    throw new Error('팔로워 수를 찾을 수 없습니다.');
  } catch (error) {
    console.error('Threads 크롤링 중 오류 발생:', error);
    throw error;
  } finally {
    if (!browser) return;
    await browser.close();
  }
}
