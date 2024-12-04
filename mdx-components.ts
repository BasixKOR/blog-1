import CustomComponents from '@/components/ui';

export function useMDXComponents(components) {
  return {
    ...components,
    ...CustomComponents,
  };
}
