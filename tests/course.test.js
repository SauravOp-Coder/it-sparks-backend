import test from 'node:test';
import assert from 'node:assert/strict';

import Course from '../src/models/Course.js';

test('course schema exposes dropdownName with a default value', () => {
  const dropdownNamePath = Course.schema.path('dropdownName');
  assert.ok(dropdownNamePath, 'dropdownName should be defined on the schema');
  assert.equal(dropdownNamePath.defaultValue, '', 'dropdownName should default to an empty string');
});
