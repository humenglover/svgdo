export default {
  title: 'SVG 에디터',
  upload: '업로드',
  url: 'URL',
  pasteCode: '코드 붙여넣기',
  pasteCodeTitle: 'SVG 코드 붙여넣기',
  syntaxError: 'SVG 구문 오류',
  library: '아이콘 라이브러리',
  empty: {
    welcome: 'SVG 에디터에 오신 것을 환영합니다',
    desc: 'SVG 파일을 드래그 앤 드롭하거나 "업로드/아이콘 라이브러리"를 클릭, Ctrl/Cmd+V로 코드 붙여넣기',
    pastePlaceholder: 'SVG 코드를 여기에 붙여넣으세요...',
    startFromExample: '예제로 시작하기',
    startFromExampleDesc: '아래 아이콘을 클릭하거나 직접 SVG를 업로드하세요.',
    keyboardHint: '단축키: Ctrl + 스크롤 | Ctrl+± 확대/축소 | Ctrl+0 리셋'
  },
  toolbar: {
    undo: '실행 취소', redo: '다시 실행', zoomIn: '확대', zoomOut: '축소',
    fit: '화면 맞춤', reset: '확대 초기화', canvasBg: '배경',
    preview: '미리보기', split: '분할', code: '코드'
  },
  transform: {
    title: '변형', rotate: '회전', flip: '반전',
    flipH: '가로', flipV: '세로', scale: '크기 조정',
  },
  optimize: {
    title: '최적화', original: '원본', current: '현재', mode: '모드',
    modeSafe: '안전', modeAggressive: '강력',
    btnOptimize: '최적화',
    copySvg: 'SVG 복사', copyOptimized: '최적화본 복사',
    copyOriginal: '원본 복원',
    optimizeSuccess: '최적화 성공! {{bytes}}바이트 절감 ({{percent}}%)',
    alreadyOptimized: '이미 최적화되어 있습니다!',
    optimizeFailed: '최적화 실패',
    restored: '원본 코드로 복원됨',
    copied: '복사됨'
  },
  export: {
    title: '내보내기',
    exportPng: 'PNG 내보내기',
    bgTransparent: '투명', bgWhite: '흰색', bgBlack: '검은색',
    btnExportPng: 'PNG 내보내기',
    downloadSvg: 'SVG 다운로드',
    downloading: '다운로드 시작',
    exported: 'PNG 내보내기 완료'
  },
  code: { title: 'SVG 코드', copy: '복사', copied: '복사됨' },
  libraryModal: {
    title: '아이콘 라이브러리', search: '아이콘 검색...',
    results: '{{count}}개 결과', loadMore: '더 불러오기',
  },
  urlModal: {
    title: 'URL에서 불러오기',
    desc: '공개된 SVG 파일의 직접 URL을 입력하세요.',
    placeholder: 'https://example.com/icon.svg',
    cancel: '취소', load: 'SVG 불러오기', loadSuccess: 'SVG 로드 성공'
  },
  article: {
    introTitle: 'SVG 에디터 가이드',
    introDesc: 'SVG 코드를 붙여넣거나 파일을 드래그 앤 드롭하세요. 실시간 미리보기, 강력한 최적화, PNG 내보내기.',
    principle: '100% 로컬 처리: 모든 작업이 브라우저 내에서 처리됩니다. 서버 업로드 없음, 개인정보 위험 제로.',
    howToUse: '사용 방법',
    whatIs: '자주 묻는 질문',
    whatIsDesc1: '시작하기 위한 팁:',
    whatIsDesc2: '',
    badges: ['양방향 동기화', '강력 압축', 'HD PNG 출력', '100% 로컬'],
    steps: [
      { title: '1단계. 가져오기', desc: 'Ctrl+V로 코드를 붙여넣거나, URL에서 가져오거나, 라이브러리에서 선택합니다.' },
      { title: '2단계. 편집', desc: '왼쪽 코드를 편집하면 오른쪽에 즉시 반영됩니다.' },
      { title: '3단계. 최적화', desc: '"최적화"를 클릭하여 불필요한 태그와 메타데이터를 제거합니다.' },
      { title: '4단계. 내보내기', desc: '최적화된 SVG 또는 PNG로 다운로드합니다.' },
    ],
    features: [
      { title: '단축키가 있나요?', desc: 'Ctrl + 스크롤로 확대/축소, Ctrl +/- 로 조정, Ctrl + 0 으로 초기화할 수 있습니다.' },
      { title: '코드와 캔버스가 동기화되나요?', desc: '네. 캔버스에서의 변형 작업이 즉시 코드에 반영됩니다.' },
      { title: '압축률이 왜 이렇게 높나요?', desc: '디자인 도구가 출력하는 SVG에서 빈 태그와 과도한 정밀도의 좌표를 적극적으로 제거하기 때문입니다.' }
    ],
  },
  mobile: { canvas: '캔버스', transform: '변형', optimize: '최적화', export: '내보내기' }
}
