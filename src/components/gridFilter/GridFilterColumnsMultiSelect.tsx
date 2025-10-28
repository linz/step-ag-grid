import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';

export interface CheckboxMultiFilterParams extends IFilterParams {
  labels?: Record<string, string>;
  labelFormatter?: (value: string) => string;
}

export class GridFilterColumnsMultiSelect {
  private params!: CheckboxMultiFilterParams;
  private selectedValues = new Set<string>();
  private labels: Record<string, string> = {};
  private allValues: string[] = [];
  private checkboxElements: Record<string, HTMLInputElement> = {};
  private gui!: HTMLElement;
  private labelFormatter?: (value: string) => string;

  init(params: CheckboxMultiFilterParams): void {
    this.params = params;
    this.labels = { ...params.labels };
    this.labelFormatter = params.labelFormatter;

    const field = params.colDef.field as string;
    const values = new Set<string>();
    params.api.forEachNode((node) => {
      if (node.data && typeof node.data === 'object' && field in node.data) {
        const val = (node.data as Record<string, unknown>)[field];
        if (val !== undefined && val !== null && typeof val === 'string') {
          values.add(val);
        }
      }
    });

    this.allValues = Array.from(values).sort();
    this.gui = document.createElement('div');
    this.gui.style.padding = '4px';

    // Select All
    const selectAllLabel = document.createElement('label');
    selectAllLabel.style.display = 'block';
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.addEventListener('change', () => {
      if (selectAllCheckbox.checked) {
        this.allValues.forEach((val) => this.selectedValues.add(val));
      } else {
        this.selectedValues.clear();
      }
      this.updateCheckboxes();
      this.params.filterChangedCallback();
    });
    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.appendChild(document.createTextNode(' Select All'));
    this.gui.appendChild(selectAllLabel);

    // Individual checkboxes
    this.allValues.forEach((val) => {
      const label = document.createElement('label');
      label.style.display = 'block';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = val;

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedValues.add(val);
        } else {
          this.selectedValues.delete(val);
        }
        selectAllCheckbox.checked = this.selectedValues.size === this.allValues.length;
        this.params.filterChangedCallback();
      });

      this.checkboxElements[val] = checkbox;

      label.appendChild(checkbox);
      const rawLabel = this.labels[val] || val;
      const displayLabel = this.labelFormatter ? this.labelFormatter(rawLabel) : rawLabel;
      label.appendChild(document.createTextNode(' ' + displayLabel));
      this.gui.appendChild(label);
    });
  }

  updateCheckboxes(): void {
    for (const val of this.allValues) {
      const checkbox = this.checkboxElements[val];
      checkbox.checked = this.selectedValues.has(val);
    }
  }

  getGui(): HTMLElement {
    return this.gui;
  }

  isFilterActive(): boolean {
    return this.selectedValues.size > 0;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const field = this.params.colDef.field as string;
    if (!params.data || typeof params.data !== 'object' || !(field in params.data)) {
      return false;
    }
    const cellValue = (params.data as Record<string, unknown>)[field];
    if (typeof cellValue !== 'string') {
      return false;
    }
    return this.selectedValues.has(cellValue);
  }

  getModel(): { values: string[] } | null {
    return this.selectedValues.size > 0 ? { values: Array.from(this.selectedValues) } : null;
  }

  setModel(model: { values: string[] } | null): void {
    this.selectedValues = new Set(model?.values || []);
    this.updateCheckboxes();
  }
}

export const createCheckboxMultiFilterParams = (
  labels: Record<string, string> = {},
  labelFormatter?: (value: string) => string,
): Partial<CheckboxMultiFilterParams> => ({
  labels,
  labelFormatter,
});
