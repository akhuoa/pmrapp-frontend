import { describe, expect, it } from 'vitest';
import { detectCodeLanguage, loadCodeLanguage } from './codeLanguage';

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
