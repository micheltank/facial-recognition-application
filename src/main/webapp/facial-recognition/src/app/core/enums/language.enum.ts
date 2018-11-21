export class Language {
  static BRAZILIAN_PORTUGUESE = 'pt-br';
  static ENGLISH = 'en';
  static SPANISH = 'es';
  static CUSTOM_SUFFIX = '-custom';

  static asKey(enumValue: string) {
    // precisa garantir que se for uma tradução customizada, vai buscar a linguagem sem o sufixo
    const language = enumValue.replace(Language.CUSTOM_SUFFIX, '');

    switch (language) {
      case Language.BRAZILIAN_PORTUGUESE:
        return 'BRAZILIAN_PORTUGUESE';
      case Language.ENGLISH:
        return 'ENGLISH';
      case Language.SPANISH:
        return 'SPANISH';
      default:
        throw new Error('Linguagem não implementada');
    }
  }
}
