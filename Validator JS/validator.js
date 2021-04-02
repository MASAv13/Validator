class Validator {
  constructor() {
    this._errors = [];
    this._types = ['number', 'string', 'array', 'object'];
    this._failed = false;
  }


  get Errors() {
    return this._errors;
  }
  
  pushError(error) {
    this._errors.push(error);  
  }

  checkNumber(schema, dataToValidate) {
    if (typeof dataToValidate !== 'number') {
      this.fail('Type is incorrect');
    }
  }

  fail(error) {
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
  
      if (schema.anyOf) {
        const anyOfTypes = [];
  
        for (let i = 0; i < schema.anyOf.length; i++) {
          anyOfTypes.push(schema.anyOf[i].type);
        }
  
        if (anyOfTypes.includes(typeof dataToValidate)) {
          this._failed = true;
        }
        
        this.pushError('None schemas are valid');
      }

      if (schema.type === 'number') {
        this.checkNumber(schema, dataToValidate);
      }
    }
    
    return !this._failed;
  }

}