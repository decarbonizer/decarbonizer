import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormEngineProps } from './FormEngine';
import { FormSchema } from './formSchema';
import { evaluteFormRules } from './internals/rules';
import { validateForm } from './internals/validation';
import { FormEngineRuleEvaluationResults, FormEngineValidationErrors, FormEngineValue } from './types';

export function useFormEngine(schema: FormSchema = { pages: [] }, initialValue: FormEngineValue = {}, initialPage = 1) {
  const [value, setValue] = useState(initialValue);
  const [page, setPage] = useState(initialPage);
  const [ruleEvaluationResults, setRuleEvaluationResults] = useState<FormEngineRuleEvaluationResults>({});
  const [validationErrors, setValidationErrors] = useState<FormEngineValidationErrors>({});
  const schemaElementsOnThisPage = useMemo(() => schema.pages[page - 1]?.elements ?? [], [schema, page]);
  const canGoToNext = page < schema.pages.length;
  const canGoToPrevious = page > 1;

  useEffect(() => {
    setRuleEvaluationResults(evaluteFormRules(schemaElementsOnThisPage, value));
  }, [schemaElementsOnThisPage, value]);

  const revalidate = useCallback(() => {
    const newValidationErrors = validateForm(schemaElementsOnThisPage, ruleEvaluationResults, value);
    setValidationErrors(newValidationErrors);
    return newValidationErrors;
  }, [schemaElementsOnThisPage, ruleEvaluationResults, value]);

  const goToPage = useCallback(
    (nextPage: number) => setPage(Math.max(1, Math.min(schema.pages.length, nextPage))),
    [schema],
  );

  const goToNext = useCallback(() => {
    const allErrorArrays = Object.values(revalidate());

    if (allErrorArrays.every((errors) => errors.length === 0)) {
      goToPage(page + 1);
      return true;
    } else {
      return false;
    }
  }, [revalidate, page, goToPage]);

  const goToPrevious = useCallback(() => goToPage(page - 1), [page, goToPage]);

  const verifySubmit = useCallback(() => {
    const allErrorArrays = Object.values(revalidate());
    return allErrorArrays.every((errors) => errors.length === 0);
  }, [revalidate]);

  const handleValueChanged: FormEngineProps['onValueChanged'] = useCallback(({ value: newValue }) => {
    setValue(newValue);
  }, []);

  return {
    value,
    page,
    ruleEvaluationResults,
    validationErrors,
    canGoToNext,
    canGoToPrevious,
    goToPage,
    goToPrevious,
    goToNext,
    verifySubmit,
    handleValueChanged,
  };
}
