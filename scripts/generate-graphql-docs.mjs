import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import graphql from 'graphql';
import spectaql from 'spectaql';

const { getIntrospectionQuery } = graphql;
const { run } = spectaql;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const endpoint =
  process.env.GRAPHQL_API_URL ||
  'https://main-practice.codebootcamp.co.kr/graphql';
const metadataPath = path.join(rootDir, 'docs/graphql/metadata.ko.json');
const configPath = path.join(rootDir, 'spectaql.yml');
const outputPath = path.join(rootDir, 'public/graphql-docs/index.html');
const fieldKeys = {
  OBJECT: 'fields',
  INPUT_OBJECT: 'inputFields',
  ENUM: 'enumValues',
  INTERFACE: 'fields',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasExample(metadata) {
  return Object.hasOwn(metadata?.documentation ?? {}, 'example');
}

function describe(metadata) {
  const sections = [metadata.description];
  if (metadata.auth) sections.push('**인증:** ' + metadata.auth);
  if (metadata.note) sections.push('**참고:** ' + metadata.note);
  return sections.filter(Boolean).join('\n\n');
}

function classifyAuth(auth) {
  if (auth.includes('불필요')) return 'public';
  if (
    auth.includes('추정') ||
    auth.includes('확인') ||
    auth.includes('스키마상')
  ) {
    return 'unknown';
  }
  return auth.includes('필요') ? 'required' : 'unknown';
}

function addAuthFilter(html, metadata) {
  const authByOperation = {};
  const counts = { all: 0, required: 0, public: 0, unknown: 0 };

  for (const [typeName, prefix] of [
    ['Query', 'query'],
    ['Mutation', 'mutation'],
  ]) {
    const fields = metadata.OBJECT[typeName].fields;
    for (const [fieldName, fieldMetadata] of Object.entries(fields)) {
      const category = classifyAuth(fieldMetadata.auth);
      authByOperation[prefix + '-' + fieldName] = {
        category,
        auth: fieldMetadata.auth,
      };
      counts.all += 1;
      counts[category] += 1;
    }
  }

  const styles = [
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Ctext y=%2252%22 font-size=%2252%22%3EG%3C/text%3E%3C/svg%3E">',
    '<style>',
    '#spectaql .auth-filter{padding:16px 20px 28px;background:#fff}',
    '#spectaql .auth-filter-controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap}',
    '#spectaql .auth-filter label{font-weight:600}',
    '#spectaql .auth-filter select{min-height:40px;padding:6px 36px 6px 10px;border:1px solid #999;border-radius:4px;background:#fff;color:#2d3134;font:inherit}',
    '#spectaql .auth-filter-status{margin:0;color:#555;font-size:.875em}',
    '#spectaql .operation-heading{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '#spectaql .auth-badge{flex-shrink:0;padding:2px 7px;border-radius:999px;font:600 .72em/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}',
    '#spectaql .auth-badge-required{color:#0d47a1;background:#e3f2fd}',
    '#spectaql .auth-badge-public{color:#1b5e20;background:#e8f5e9}',
    '#spectaql .auth-badge-unknown{color:#7c2d12;background:#fff3e0}',
    '#spectaql .operation[hidden],#spectaql .group-heading[hidden],#spectaql #nav li[hidden]{display:none}',
    '@media (min-width:48em){#spectaql .auth-filter{width:50%;padding-left:40px;padding-right:40px}}',
    '</style>',
  ].join('');

  const toolbar = [
    '<section class="auth-filter" aria-labelledby="auth-filter-label">',
    '<div class="auth-filter-controls">',
    '<label id="auth-filter-label" for="auth-filter-select">인증 필터</label>',
    '<select id="auth-filter-select">',
    '<option value="all">전체 (' + counts.all + ')</option>',
    '<option value="required">인증 필요 (' + counts.required + ')</option>',
    '<option value="public">인증 불필요 (' + counts.public + ')</option>',
    '<option value="unknown">확인 필요 (' + counts.unknown + ')</option>',
    '</select>',
    '<p id="auth-filter-status" class="auth-filter-status" role="status" aria-live="polite"></p>',
    '</div>',
    '</section>',
  ].join('');

  const labels = {
    required: '인증 필요',
    public: '인증 불필요',
    unknown: '확인 필요',
  };
  const script = [
    '<script>',
    '(function(){',
    'var authByOperation=' +
      JSON.stringify(authByOperation).replaceAll('<', '\\u003c') +
      ';',
    'var labels=' + JSON.stringify(labels) + ';',
    'var select=document.getElementById("auth-filter-select");',
    'var status=document.getElementById("auth-filter-status");',
    'var operations=Array.from(document.querySelectorAll("#spectaql .operation"));',
    'operations.forEach(function(operation){',
    'var info=authByOperation[operation.id];',
    'if(!info)return;',
    'operation.dataset.auth=info.category;',
    'var badge=document.createElement("span");',
    'badge.className="auth-badge auth-badge-"+info.category;',
    'badge.textContent=labels[info.category];',
    'badge.title=info.auth;',
    'operation.querySelector(".operation-heading").appendChild(badge);',
    '});',
    'function update(){',
    'var selected=select.value;',
    'var visible=0;',
    'operations.forEach(function(operation){',
    'operation.hidden=selected!=="all"&&operation.dataset.auth!==selected;',
    'if(!operation.hidden)visible+=1;',
    '});',
    'document.querySelectorAll("#nav a[href^=\\"#query-\\"],#nav a[href^=\\"#mutation-\\"]").forEach(function(link){',
    'var operation=document.getElementById(link.getAttribute("href").slice(1));',
    'link.closest("li").hidden=Boolean(operation&&operation.hidden);',
    '});',
    'document.querySelectorAll("#spectaql .group-heading").forEach(function(heading){',
    'if(!heading.id.startsWith("group-Operations-"))return;',
    'var sibling=heading.nextElementSibling;',
    'var hasVisibleOperation=false;',
    'while(sibling&&!sibling.classList.contains("group-heading")){',
    'if(sibling.classList.contains("operation")&&!sibling.hidden)hasVisibleOperation=true;',
    'sibling=sibling.nextElementSibling;',
    '}',
    'heading.hidden=!hasVisibleOperation;',
    '});',
    'status.textContent=visible+"개 작업 표시";',
    '}',
    'select.addEventListener("change",update);',
    'update();',
    '}());',
    '</script>',
  ].join('');

  assert(html.includes('</head>'), 'SpectaQL head 종료 태그가 없습니다.');
  assert(
    html.includes('<h1 id="group-Operations-Queries"'),
    'SpectaQL Query 그룹을 찾을 수 없습니다.',
  );
  assert(html.includes('</body>'), 'SpectaQL body 종료 태그가 없습니다.');

  return html
    .replace('</head>', styles + '</head>')
    .replace(
      '<h1 id="group-Operations-Queries"',
      toolbar + '<h1 id="group-Operations-Queries"',
    )
    .replace('</body>', script + '</body>');
}

function validateAndApply(schema, metadata) {
  const types = schema.types.filter((type) => !type.name.startsWith('__'));
  const liveTypes = new Map(types.map((type) => [type.kind + ':' + type.name, type]));
  let fieldCount = 0;
  let argumentCount = 0;

  for (const type of types) {
    const typeMetadata = metadata[type.kind]?.[type.name];
    assert(typeMetadata, '타입 메타데이터 누락: ' + type.kind + '.' + type.name);
    assert(typeMetadata.description?.trim(), '타입 설명 누락: ' + type.name);
    type.description = describe(typeMetadata);

    const fieldKey = fieldKeys[type.kind];
    const fields = fieldKey ? type[fieldKey] ?? [] : [];
    const metadataFields = fieldKey ? typeMetadata[fieldKey] ?? {} : {};
    fieldCount += fields.length;

    for (const field of fields) {
      const fieldMetadata = metadataFields[field.name];
      assert(
        fieldMetadata,
        '필드 메타데이터 누락: ' + type.name + '.' + field.name,
      );
      assert(
        fieldMetadata.description?.trim(),
        '필드 설명 누락: ' + type.name + '.' + field.name,
      );
      if (type.name === 'Query' || type.name === 'Mutation') {
        assert(
          fieldMetadata.auth?.trim(),
          '인증 설명 누락: ' + type.name + '.' + field.name,
        );
      }
      if (type.kind === 'INPUT_OBJECT') {
        assert(
          hasExample(fieldMetadata),
          '입력 예시 누락: ' + type.name + '.' + field.name,
        );
      }
      field.description = describe(fieldMetadata);

      const args = field.args ?? [];
      const metadataArgs = fieldMetadata.args ?? {};
      argumentCount += args.length;
      for (const arg of args) {
        const argMetadata = metadataArgs[arg.name];
        assert(
          argMetadata,
          '인자 메타데이터 누락: ' +
            type.name +
            '.' +
            field.name +
            '(' +
            arg.name +
            ')',
        );
        assert(
          argMetadata.description?.trim(),
          '인자 설명 누락: ' +
            type.name +
            '.' +
            field.name +
            '(' +
            arg.name +
            ')',
        );
        assert(
          hasExample(argMetadata),
          '인자 예시 누락: ' +
            type.name +
            '.' +
            field.name +
            '(' +
            arg.name +
            ')',
        );
        arg.description = describe(argMetadata);
      }

      const liveArgNames = new Set(args.map((arg) => arg.name));
      for (const argName of Object.keys(metadataArgs)) {
        assert(
          liveArgNames.has(argName),
          '스키마에 없는 인자 메타데이터: ' +
            type.name +
            '.' +
            field.name +
            '(' +
            argName +
            ')',
        );
      }
    }

    const liveFieldNames = new Set(fields.map((field) => field.name));
    for (const fieldName of Object.keys(metadataFields)) {
      assert(
        liveFieldNames.has(fieldName),
        '스키마에 없는 필드 메타데이터: ' + type.name + '.' + fieldName,
      );
    }

    if (type.kind === 'SCALAR') {
      assert(hasExample(typeMetadata), '스칼라 예시 누락: ' + type.name);
    }
  }

  for (const [kind, kindMetadata] of Object.entries(metadata)) {
    for (const typeName of Object.keys(kindMetadata)) {
      assert(
        liveTypes.has(kind + ':' + typeName),
        '스키마에 없는 타입 메타데이터: ' + kind + '.' + typeName,
      );
    }
  }

  return {
    typeCount: types.length,
    fieldCount,
    argumentCount,
    queryCount: schema.queryType
      ? schema.types.find((type) => type.name === schema.queryType.name)?.fields
          ?.length ?? 0
      : 0,
    mutationCount: schema.mutationType
      ? schema.types.find((type) => type.name === schema.mutationType.name)
          ?.fields?.length ?? 0
      : 0,
  };
}

async function fetchSchema() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      operationName: 'IntrospectionQuery',
      query: getIntrospectionQuery({
        descriptions: true,
        inputValueDeprecation: false,
        schemaDescription: true,
        specifiedByUrl: false,
      }),
    }),
  });
  const payload = await response.json();
  assert(
    response.ok,
    'introspection HTTP 오류: ' +
      response.status +
      ' ' +
      JSON.stringify(payload.errors ?? payload),
  );
  assert(!payload.errors, 'introspection 오류: ' + JSON.stringify(payload.errors));
  assert(payload.data?.__schema, 'introspection 스키마가 없습니다.');
  return payload;
}

async function main() {
  const [payload, metadataText] = await Promise.all([
    fetchSchema(),
    readFile(metadataPath, 'utf8'),
  ]);
  const metadata = JSON.parse(metadataText);
  const summary = validateAndApply(payload.data.__schema, metadata);
  const summaryText =
    '메타데이터 검증 완료: 타입 ' +
    summary.typeCount +
    '개, 필드 ' +
    summary.fieldCount +
    '개, 인자 ' +
    summary.argumentCount +
    '개, Query ' +
    summary.queryCount +
    '개, Mutation ' +
    summary.mutationCount +
    '개';

  if (process.argv.includes('--check')) {
    console.log(summaryText);
    return;
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), 'triptrip-spectaql-'));
  const introspectionPath = path.join(tempDir, 'introspection.ko.json');
  try {
    await writeFile(introspectionPath, JSON.stringify(payload, null, 2));
    await run({
      specFile: configPath,
      introspectionFile: introspectionPath,
    });
    const html = await readFile(outputPath, 'utf8');
    await writeFile(outputPath, addAuthFilter(html, metadata));
    const output = await stat(outputPath);
    assert(output.size > 0, 'SpectaQL HTML이 생성되지 않았습니다.');
    console.log(summaryText);
    console.log('문서 생성 완료: ' + outputPath);
  } finally {
    await rm(tempDir, { recursive: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
