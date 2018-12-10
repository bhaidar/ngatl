import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';

export class FormField implements FormlyFieldConfig {
  public static field(
    type: string,
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return {
      type,
      key,
      templateOptions,
      ...options
    };
  }

  public static input(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.field('input', key, templateOptions, options);
  }

  public static email(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    const defaults = {
      type: 'email',
      label: 'Email'
    };
    const defaultOptions = { validators: { validation: ['email'] } };

    return FormField.input(
      key,
      { ...templateOptions, ...defaults },
      { ...options, ...defaultOptions }
    );
  }

  public static password(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    const defaults = {
      label: 'Password',
      type: 'password',
      minLength: 8,
      required: true
    };

    return FormField.input(key, { ...templateOptions, ...defaults }, options);
  }

  public static number(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.input(
      key,
      { ...templateOptions, type: 'number' },
      { ...options }
    );
  }

  public static checkbox(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.field('checkbox', key, templateOptions, options);
  }

  public static radio(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.field('radio', key, templateOptions, options);
  }

  public static select(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.field('select', key, templateOptions, options);
  }

  public static textarea(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.field('textarea', key, templateOptions, options);
  }

  public static repeat(
    key: string,
    fieldArray: FormlyFieldConfig,
    options = {}
  ): FormlyFieldConfig {
    return FormField.field('repeat', key, options, { fieldArray });
  }

  public static group(
    fieldGroupClassName: string,
    fieldGroup: FormlyFieldConfig[]
  ): FormlyFieldConfig {
    return { fieldGroupClassName, fieldGroup };
  }

  public static template(template: string): FormlyFieldConfig {
    return { type: 'formly-template', template };
  }

  public static date(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.input(
      key,
      { ...templateOptions, type: 'date' },
      { ...options }
    );
  }

  public static time(
    key: string,
    templateOptions?: FormlyTemplateOptions,
    options?: any
  ): FormlyFieldConfig {
    return FormField.input(
      key,
      { ...templateOptions, type: 'time' },
      { ...options }
    );
  }
}
