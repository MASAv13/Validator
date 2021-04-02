class Validator {
  constructor() {
    this._errors = [];
    this._types = ['number', 'string', 'array', 'object', 'boolean'];
    this._failed = false;
    this.formats = {
      email: /^[\d|\w]+@[\d|\w]+.\w+$/,
      date: /^\d{4}-\d{2}-\d{2}$/
    };
  }

  get Errors() {
    return this._errors;
  }

  isExist(variable) {
    return variable !== null && variable !== undefined;
  }
  
  pushError(error) {
    this._errors.push(error);  
  }

  isArray(data) {
    return Object.prototype.toString.call(data) === '[object Array]'
  }

  checkNumber(schema, dataToValidate) {
    if (typeof dataToValidate !== 'number') {
      this.fail('Type is incorrect');
    }

    if (this.isExist(schema.minimum) && dataToValidate < schema.minimum) {
      this.fail('Value is less than it can be');
    }

    if (this.isExist(schema.maximum) && dataToValidate > schema.maximum) {
      this.fail('Value is greater than it can be');
    }

    if (this.isExist(schema.enum) && !schema.enum.includes(dataToValidate)) {
      this.fail('The enum does not support value');
    }
  }

  checkString(schema, dataToValidate) {
    if (typeof dataToValidate !== 'string') {
      this.fail('Type is incorrect');
    }

    if (this.isExist(schema.maxLength) && dataToValidate.length > schema.maxLength) {
      this.fail ('Too long string');
    }

    if (this.isExist(schema.minLength) && dataToValidate.length < schema.minLength) {
      this.fail ('Too short string');
    }

    if (this.isExist(schema.pattern) && !schema.pattern.test(dataToValidate)) {
      this.fail ('String does not match pattern');
    }

    if (this.isExist(schema.enum) && !schema.enum.includes(dataToValidate)) {
      this.fail ('The enum does not support value');
    }

    if (
      this.isExist(schema.format) &&
      !this.formats[schema.format].test(dataToValidate)
    ) {
      this.fail('Format of string is not valid');
    }
  }
  
  checkBoolean(schema, dataToValidate) {
    if (typeof dataToValidate !== 'boolean') {
      this.fail('Type is incorrect');
    }
  }

  checkMassive(schema, dataToValidate) {
    if (!this.isArray(dataToValidate)) {
      this.fail('Type is incorrect');
    }

    if (this.isExist(schema.maxItems) && dataToValidate.length > schema.maxItems) {
      this.fail('Items count more than can be');
    }

    if (this.isExist(schema.minItems) && dataToValidate.length < schema.minItems) {
      this.fail('Items count less than can be');
    }

    if (this.isExist(schema.items)) {
      if (this.isArray(schema.items)) {
        //дописать oneOf и anyOf
      } else {
        dataToValidate.forEach((element) => {
          const isValid = this.isValid(schema.items, element);

          if (!isValid) {
            this.fail('Type is incorrect');
          }
        });
      }
    }
  }

  fail (error) {
   if (error) {
      this.pushError(error);
   }

   this._failed = true;
  }
  /**
   *
   * @param schema
   * @param dataToValidate
   * @returns {boolean}
   */
  isValid(schema = {}, dataToValidate) {
    if (dataToValidate === null) {
      if (!schema.nullable) {
        this.fail('Value is null, but nullable false');
      }
    } else { 
      if (schema.type && !this._types.includes(schema.type)) {
        this.fail('Unknown type');
      }

      if (schema.type === 'number') {
        this.checkNumber(schema, dataToValidate);
      }

      if (schema.type === 'string') {
        this.checkString(schema, dataToValidate);
      }

      if (schema.type === 'boolean') {
        this.checkBoolean(schema, dataToValidate);
      }

      if (schema.type === 'array') {
        this.checkMassive(schema, dataToValidate);
      }
    }

    return !this._failed;
  }

}