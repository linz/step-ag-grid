import './GridFilterColumnsMultiSelect.scss';

import { LuiCheckboxInput } from '@linzjs/lui';
import type { IDoesFilterPassParams, IFilterComp, IFilterParams } from 'ag-grid-community';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

export interface CheckboxMultiFilterParams extends IFilterParams {
  labels?: Record<string, string>;
  labelFormatter?: (value: string) => string;
}

export interface CheckboxMultiFilterModel {
  values: string[];
}

interface FilterUIProps {
  allValues: string[];
  selected: Set<string>;
  labels: Record<string, string>;
  labelFormatter?: (value: string) => string;
  onToggleAll: (checked: boolean) => void;
  onToggleOne: (value: string, checked: boolean) => void;
}

const EMPTY_KEY = '__EMPTY__';
const DEFAULT_EMPTY_LABEL = '-';

const FilterUI: React.FC<FilterUIProps> = ({
  allValues,
  selected,
  labels,
  labelFormatter,
  onToggleAll,
  onToggleOne,
}) => {
  const allChecked = allValues.length > 0 && selected.size === allValues.length;

  const getDisplayLabel = (raw: string): string => {
    const base = raw === EMPTY_KEY ? (labels[EMPTY_KEY] ?? DEFAULT_EMPTY_LABEL) : (labels[raw] ?? raw);
    return labelFormatter ? labelFormatter(base) : base;
  };

  return (
    <div className="GridFilterColsMultiSelect">
      <span className="LuiSelect-label-text">Filter column</span>

      <LuiCheckboxInput
        className="LuiCheckboxInput-selectAll"
        label={'Select All'}
        value="true"
        isChecked={allChecked}
        onChange={(e) => onToggleAll(e.target.checked)}
      />
      {allValues.map((val) => (
        <LuiCheckboxInput
          key={val}
          className="LuiCheckboxInput-item"
          label={getDisplayLabel(val)}
          value={val}
          isChecked={selected.has(val)}
          onChange={(e) => onToggleOne(val, e.target.checked)}
        />
      ))}
    </div>
  );
};

export class GridFilterColumnsMultiSelect implements IFilterComp {
  private params!: CheckboxMultiFilterParams;
  private selectedValues = new Set<string>();
  private labels: Record<string, string> = {};
  private allValues: string[] = [];
  private gui!: HTMLElement;
  private labelFormatter?: (value: string) => string;
  private reactRoot: Root | null = null;

  private normalizeCellValue(value: unknown): string {
    if (typeof value === 'string') return value.trim() === '' ? EMPTY_KEY : value;
    return EMPTY_KEY;
  }

  private loadFieldValues(): string[] {
    const field = this.params.colDef.field as string;
    const values = new Set<string>();

    this.params.api.forEachNode((node) => {
      const data = node.data ?? {};
      const raw = (data as Record<string, unknown>)[field];
      const norm = this.normalizeCellValue(raw);
      values.add(norm);
    });

    return Array.from(values).sort((a, b) => {
      if (a === EMPTY_KEY && b !== EMPTY_KEY) return -1;
      if (b === EMPTY_KEY && a !== EMPTY_KEY) return 1;
      return a.localeCompare(b);
    });
  }

  init(params: CheckboxMultiFilterParams): void {
    this.params = params;
    this.labels = { ...params.labels };
    this.labelFormatter = params.labelFormatter;

    if (!(EMPTY_KEY in this.labels)) {
      this.labels[EMPTY_KEY] = DEFAULT_EMPTY_LABEL;
    }

    this.allValues = this.loadFieldValues();
    this.selectedValues = new Set(this.allValues);

    this.gui = document.createElement('div');
    this.reactRoot = createRoot(this.gui);
    this.render();
  }

  private render(): void {
    if (!this.reactRoot) return;

    this.reactRoot.render(
      <FilterUI
        allValues={this.allValues}
        selected={this.selectedValues}
        labels={this.labels}
        labelFormatter={this.labelFormatter}
        onToggleAll={this.handleToggleAll.bind(this)}
        onToggleOne={this.handleToggleOne.bind(this)}
      />,
    );
  }

  private handleToggleAll(checked: boolean): void {
    if (checked) {
      this.allValues.forEach((val) => this.selectedValues.add(val));
    } else {
      this.selectedValues.clear();
    }
    this.render();
    this.params.filterChangedCallback();
  }

  private handleToggleOne(value: string, checked: boolean): void {
    if (checked) {
      this.selectedValues.add(value);
    } else {
      this.selectedValues.delete(value);
    }
    this.render();
    this.params.filterChangedCallback();
  }

  getGui(): HTMLElement {
    return this.gui;
  }

  isFilterActive(): boolean {
    return this.selectedValues.size > 0;
  }

  doesFilterPass(p: IDoesFilterPassParams): boolean {
    const field = this.params.colDef.field as string;
    if (!p.data || typeof p.data !== 'object') {
      return this.selectedValues.has(EMPTY_KEY);
    }

    const raw = (p.data as Record<string, unknown>)[field];
    const norm = this.normalizeCellValue(raw);
    return this.selectedValues.has(norm);
  }

  getModel(): CheckboxMultiFilterModel | null {
    return this.selectedValues.size > 0 ? { values: Array.from(this.selectedValues) } : null;
  }

  setModel(model: CheckboxMultiFilterModel | null): void {
    this.selectedValues = new Set(model?.values || []);
    this.render();
  }

  destroy(): void {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }
}

export const createCheckboxMultiFilterParams = (
  labels: Record<string, string> = {},
  labelFormatter?: (value: string) => string,
): Partial<CheckboxMultiFilterParams> => ({
  labels: { [EMPTY_KEY]: DEFAULT_EMPTY_LABEL, ...labels },
  labelFormatter,
});
