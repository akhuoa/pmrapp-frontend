export const MATHML_FORMAT_OPTIONS = [
  {
    key: 'digitGrouping',
    label: 'Digit Grouping',
    preview: '#,###',
    description: 'Formats numeric literals with thousands separators.',
    example: '<math><mn>1234567.89</mn></math> → <math><mn>1,234,567.89</mn></math>',
  },
  {
    key: 'greekSymbols',
    label: 'Greek Symbols',
    preview: 'α β',
    description: 'Converts Greek letter names into Greek symbols.',
    example:
      '<math><mi>alpha</mi><mo>+</mo><mi>beta</mi></math> → <math><mi>α</mi><mo>+</mo><mi>β</mi></math>',
  },
  {
    key: 'subscripts',
    label: 'Subscripts',
    preview: 'x<sub class="text-[0.7em] leading-none">n</sub>',
    description: 'Splits underscore-delimited identifiers into nested subscripts.',
    example:
      '<math><mi>q_Ca_o</mi></math> → <math><msub><msub><mi>q</mi><mi>Ca</mi></msub><mi>o</mi></msub></math>',
  },
] as const
