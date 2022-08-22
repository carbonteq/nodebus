import { JSONSerializer } from '@carbonteq/nodebus-core';

describe('serializes a JSON compliant object', () => {
  const serializer = new JSONSerializer();

  it('empty object', () => {
    expect(serializer.serialize({})).toBe('{}');
  });

  it('object with props', () => {
    const obj = {
      num: 1,
      float: 2.3,
      bool: false,
      str: 'lala',
      date: new Date(),
      arr: [1, 2, 3],
    };
    const expected = JSON.stringify(obj);
    const actual = serializer.serialize(obj);

    expect(actual).toBe(expected);
  });

  it('deeply nested object', () => {
    const obj = {
      nested: {
        num: 1,
        float: 2.3,
        bool: false,
        str: 'lala',
        date: new Date(),
        arr: [1, 2, 3],
      },
    };
    const expected = JSON.stringify(obj);
    const actual = serializer.serialize(obj);

    expect(actual).toBe(expected);
  });

  // NOTE: allow array of ISerializable
  // it('array of deeply nested objects', () => {
  //   const obj = [
  //     {
  //       nested: {
  //         num: 1,
  //         float: 2.3,
  //         bool: false,
  //         str: 'lala',
  //         date: new Date(),
  //         arr: [1, 2, 3],
  //       },
  //     },
  //   ];
  //   const expected = JSON.stringify(obj);
  //   const actual = serializer.serialize(obj);
  //
  //   expect(actual).toBe(expected);
  // });

  it('array of deeply nested objects', () => {
    const obj = {
      outerArr: [
        {
          nested: {
            num: 1,
            float: 2.3,
            bool: false,
            str: 'lala',
            date: new Date(),
            arr: [1, 2, 3],
          },
        },
      ],
    };
    const expected = JSON.stringify(obj);
    const actual = serializer.serialize(obj);

    expect(actual).toBe(expected);
  });
});
