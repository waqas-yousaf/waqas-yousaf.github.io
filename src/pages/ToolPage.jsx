import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PageSeo from '../components/seo/PageSeo';
import { getLocalizedTool, getToolSeo, buildToolJsonLd } from '../data/tools';
import NotFoundPage from './NotFoundPage';
import { useLocale } from '../i18n/useLocale';
import PasswordGenerator from '../components/tools/PasswordGenerator';
import BrowserInfo from '../components/tools/BrowserInfo';
import SlugGenerator from '../components/tools/SlugGenerator';
import LaravelKeyGenerator from '../components/tools/LaravelKeyGenerator';
import Base64Converter from '../components/tools/Base64Converter';
import JsonFormatter from '../components/tools/JsonFormatter';
import TimestampConverter from '../components/tools/TimestampConverter';
import LoremGenerator from '../components/tools/LoremGenerator';
import UrlEncoder from '../components/tools/UrlEncoder';
import JwtDecoder from '../components/tools/JwtDecoder';
import RegexTester from '../components/tools/RegexTester';
import HtmlEntityConverter from '../components/tools/HtmlEntityConverter';
import CronParser from '../components/tools/CronParser';
import ImageColorStudio from '../components/tools/ImageColorStudio';
import CssMinifier from '../components/tools/CssMinifier';
import JsFormatter from '../components/tools/JsFormatter';
import FormatConverter from '../components/tools/FormatConverter';
import NumberBaseConverter from '../components/tools/NumberBaseConverter';
import JsonConverterHub from '../components/tools/JsonConverterHub';
import MarkdownExporter from '../components/tools/MarkdownExporter';
import HtmlCleaner from '../components/tools/HtmlCleaner';

function makeConverterTool(toolId) {
  return function ConverterTool() {
    return <FormatConverter toolId={toolId} />;
  };
}

const toolComponents = {
  password: PasswordGenerator,
  slug: SlugGenerator,
  'laravel-key': LaravelKeyGenerator,
  base64: Base64Converter,
  json: JsonFormatter,
  'json-converter': JsonConverterHub,
  'markdown-export': MarkdownExporter,
  'bcd-to-decimal': NumberBaseConverter,
  timestamp: TimestampConverter,
  lorem: LoremGenerator,
  'browser-info': BrowserInfo,
  'url-encode': UrlEncoder,
  'jwt-decoder': JwtDecoder,
  regex: RegexTester,
  'html-entities': HtmlEntityConverter,
  'html-cleaner': HtmlCleaner,
  'image-color-studio': ImageColorStudio,
  'css-minifier': CssMinifier,
  'js-formatter': JsFormatter,
  cron: CronParser,
};

function ToolPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { toolId } = useParams();
  const tool = getLocalizedTool(toolId, t);
  const Component = tool ? toolComponents[tool.id] : null;

  if (!tool || !Component) {
    return <NotFoundPage />;
  }

  const seo = getToolSeo(tool, t, locale);

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
        ogImage={seo.ogImage}
        ogType={seo.ogType}
        jsonLd={buildToolJsonLd(tool, t, locale)}
        locale={locale}
      />
      <Component />
    </>
  );
}

export default ToolPage;
