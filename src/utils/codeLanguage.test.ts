import { xml } from '@codemirror/lang-xml';
import { syntaxTreeAvailable } from '@codemirror/language';
import { EditorState, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { detectCodeLanguage, loadCodeLanguage, viewportParsing } from './codeLanguage';

describe('detectCodeLanguage', () => {
  it.each([
    ['model.cellml', 'xml'],
    ['simulation.sedml', 'xml'],
    ['metadata.rdf', 'xml'],
    ['diagram.svg', 'xml'],
    ['model.xul', 'xml'],
    ['index.html', 'html'],
    ['styles.scss', 'css'],
    ['model.c', 'cpp'],
    ['model.h', 'cpp'],
    ['script.tsx', 'javascript'],
    ['generated.neon', 'json'],
    ['settings.conf', 'json'],
    ['model.py', 'python'],
    ['README.md', 'markdown'],
    ['model.f77', 'fortran'],
    ['model.m', 'matlab'],
  ])('detects %s as %s', (filename, expected) => {
    expect(detectCodeLanguage(filename)).toBe(expected);
  });

  it('is case-insensitive for extensions', () => {
    expect(detectCodeLanguage('MODEL.CellML')).toBe('xml');
  });

  it('uses the basename when a path is given', () => {
    expect(detectCodeLanguage('models/v1.2/model.py')).toBe('python');
    expect(detectCodeLanguage('folder.d/Makefile')).toBeNull();
  });

  it('returns null for unknown extensions', () => {
    expect(detectCodeLanguage('data.xyz')).toBeNull();
  });

  it('returns null for files without an extension', () => {
    expect(detectCodeLanguage('LICENSE')).toBeNull();
    expect(detectCodeLanguage('')).toBeNull();
  });
});

describe('loadCodeLanguage', () => {
  it.each([
    'cpp',
    'css',
    'fortran',
    'html',
    'javascript',
    'json',
    'markdown',
    'matlab',
    'python',
    'xml',
  ] as const)('loads the %s language support', async (id) => {
    await expect(loadCodeLanguage(id)).resolves.toBeDefined();
  });
});

describe('viewportParsing', () => {
  // A document long enough that the initial parse does not reach its end.
  const largeDoc = Array.from({ length: 20000 }, (_, i) => `<variable name="v_${i}"/>`).join('\n');
  let view: EditorView | null = null;

  // jsdom does not implement layout, which CodeMirror measures; provide empty rectangles.
  beforeAll(() => {
    Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0);
    Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    view?.destroy();
    view = null;
    vi.useRealTimers();
  });

  const createScrolledToEnd = (extensions: Extension[]): EditorView => {
    const editor = new EditorView({
      parent: document.body,
      state: EditorState.create({ doc: largeDoc, extensions }),
    });
    editor.dispatch({ effects: EditorView.scrollIntoView(largeDoc.length) });
    return editor;
  };

  it('parses up to the visible lines without waiting for the background parser', () => {
    view = createScrolledToEnd([xml(), viewportParsing]);
    expect(syntaxTreeAvailable(view.state, view.viewport.to)).toBe(false);

    // CodeMirror's own background parser does not start until 100 ms have passed.
    vi.advanceTimersByTime(60);

    expect(syntaxTreeAvailable(view.state, view.viewport.to)).toBe(true);
  });

  it('does nothing when no language is configured', () => {
    view = createScrolledToEnd([viewportParsing]);
    const dispatch = vi.spyOn(view, 'dispatch');

    vi.advanceTimersByTime(1000);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
