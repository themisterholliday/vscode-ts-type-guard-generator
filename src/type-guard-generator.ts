interface Property {
  name: string;
  typeString: string;
}

function buildFunctionSymbol(interfaceName: string): string {
  return `function is${interfaceName}(value: unknown): value is ${interfaceName}`;
}

function buildPlainObjectCheck(): string {
  return '\tif (!isPlainObject(value)) return false';
}

function buildKeyChecks(propertyNames: string[]): string {
  const hasOwnStrings = propertyNames.map((name) => {
    return `\tif (!value.hasOwn('${name}')) return false`;
  });
  return hasOwnStrings.join('\n');
}

function buildDestructure(propertyNames: string[]): string {
  return `\tconst { ${propertyNames.join(', ')} } = value`;
}

function buildTypeChecks(properties: Property[]): string {
  let allTypeCheckStrings = []

  for (const property of properties) {
    let isTypeCheckString = ""

    switch (property.typeString) {
      case "string":
        isTypeCheckString = "isString"
        break
      case "number":
        isTypeCheckString = "isNumber"
        break
      case "boolean":
        isTypeCheckString = "isBoolean"
        break
      case "string[]":
        isTypeCheckString = "isStringArray"
        break
      case "number[]":
        isTypeCheckString = "isNumberArray"
        break
      case "boolean[]":
        isTypeCheckString = "isBooleanArray"
        break
    }

    if (isTypeCheckString !== "") {
      const finalString = `\tif (!${isTypeCheckString}(${property.name})) return false`
      allTypeCheckStrings.push(finalString)
    }    
  }
  
  return allTypeCheckStrings.join("\n")
}

/**
   * trying to get to this:
   function isPerson(value: unknown): value is Person {
	// 1. Check if is plain object
	if (!isPlainObject(value)) return false
  
	// 2. Check all keys
	if (!value.hasOwn('name')) return false
	if (!value.hasOwn('age')) return false
	if (!value.hasOwn('something')) return false
  
	// 3. destructure all properties
	const { name, age, something } = value
  
	// 4.
	if (!isString(name)) return false
	if (!isNumber(age)) return false
	if (!isString(something)) return false
  
	return true
  }
   */

export function buildFullTypeGuardFunction(interfaceString: string) {
  const interfaceNameRegex = /(?<=interface)\s+(.*?)\s+(?=\{)/g;
  const interfaceNameMatches = interfaceNameRegex.exec(interfaceString);

  if (!interfaceNameMatches) {
    throw new Error('No name parsed in interface');
  }

  const interfaceName = interfaceNameMatches[1];

  const interfaceRegex = /(?<=\{)([\s\S]+)(?=\})/gm;
  const interfaceMatches = interfaceRegex.exec(interfaceString);

  if (!interfaceMatches) {
    throw new Error('No property matches in interface');
  }

  const properties = interfaceMatches[0]
    .trim()
    .split('\n')
    .map((x) => x.trim());

  const propertiesAsTypes = properties.map((property) => {
    const properties = property.replace(': ', ':').split(':');
    const typed: Property = {
      name: properties[0],
      typeString: properties[1],
    };
    return typed;
  });

  const propertyNames = propertiesAsTypes.map((property) => property.name);

  const functionSymbol = buildFunctionSymbol(interfaceName);
  const plainObjectCheck = buildPlainObjectCheck();
  const keyChecks = buildKeyChecks(propertyNames);
  const destructure = buildDestructure(propertyNames);
  const typeChecks = buildTypeChecks(propertiesAsTypes);

  const finalString = `${functionSymbol} {\n${plainObjectCheck}\n\n${keyChecks}\n\n${destructure}\n\n${typeChecks}\n\n\treturn true\n}`;
  return finalString;
}
