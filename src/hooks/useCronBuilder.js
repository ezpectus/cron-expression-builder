import { useState, useCallback, useMemo } from 'react';
import { FIELDS } from '../utils/constants.js';
import { createAllFields } from '../utils/fieldFactory.js';
import { buildCronExpression } from '../utils/cronBuilder.js';
import { generateDescription } from '../utils/cronDescription.js';
import { validateFields } from '../utils/cronValidator.js';
import { parseCronExpression } from '../utils/cronParser.js';

function createInitialState() {
  return createAllFields();
}

export function useCronBuilder() {
  const [fields, setFields] = useState(createInitialState);

  const expression = useMemo(() => buildCronExpression(fields), [fields]);
  const description = useMemo(() => generateDescription(fields), [fields]);
  const validation = useMemo(() => validateFields(fields), [fields]);

  const updateField = useCallback((fieldKey, updates) => {
    setFields((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], ...updates },
    }));
  }, []);

  const setFieldMode = useCallback((fieldKey, mode) => {
    setFields((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], mode },
    }));
  }, []);

  const setFieldStep = useCallback((fieldKey, step) => {
    setFields((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], step },
    }));
  }, []);

  const setFieldSpecific = useCallback((fieldKey, specific) => {
    setFields((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], specific },
    }));
  }, []);

  const setFieldRange = useCallback((fieldKey, rangeStart, rangeEnd) => {
    setFields((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], rangeStart, rangeEnd },
    }));
  }, []);

  const toggleSpecificValue = useCallback((fieldKey, value) => {
    setFields((prev) => {
      const current = prev[fieldKey];
      let newSpecific;
      if (current.specific.includes(value)) {
        newSpecific = current.specific.filter((v) => v !== value);
      } else {
        newSpecific = [...current.specific, value].sort((a, b) => a - b);
      }
      return {
        ...prev,
        [fieldKey]: { ...current, specific: newSpecific },
      };
    });
  }, []);

  const setFieldsFromObject = useCallback((newFields) => {
    setFields(createAllFields({
      minute: newFields[FIELDS.MINUTE] || {},
      hour: newFields[FIELDS.HOUR] || {},
      dom: newFields[FIELDS.DOM] || {},
      month: newFields[FIELDS.MONTH] || {},
      dow: newFields[FIELDS.DOW] || {},
    }));
  }, []);

  const parseExpression = useCallback((expr) => {
    const result = parseCronExpression(expr);
    if (result.success) {
      setFieldsFromObject(result.fields);
      return { success: true, error: null };
    }
    return result;
  }, [setFieldsFromObject]);

  const reset = useCallback(() => {
    setFields(createInitialState());
  }, []);

  const setFromPreset = useCallback((presetFields) => {
    setFieldsFromObject(presetFields);
  }, [setFieldsFromObject]);

  return {
    fields,
    expression,
    description,
    validation,
    updateField,
    setFieldMode,
    setFieldStep,
    setFieldSpecific,
    setFieldRange,
    toggleSpecificValue,
    setFieldsFromObject,
    parseExpression,
    reset,
    setFromPreset,
  };
}
