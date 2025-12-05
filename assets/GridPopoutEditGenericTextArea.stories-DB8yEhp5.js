import{j as t,w as i,i as E}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as l}from"./iframe-fuNulc0f.js";import{G as p,k as D,l as G,b as P,E as m,m as g,n as R}from"./GridWrapper-BAUk9ZaG.js";import{G as w,b as T}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as I}from"./GridPopoverTextArea-C2apFZQU.js";import{G as S,a as b}from"./GridUpdatingContextProvider-B4NLo6bu.js";import{A as y}from"./ActionButton-DT6uCTh5.js";import{w as C}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const c=(o,d)=>p(o,{editor:D,...d}),H={title:"Components / Grids",component:w,args:{quickFilterValue:"",selectable:!0},decorators:[o=>t.jsx("div",{style:{width:1024,height:400},children:t.jsx(S,{children:t.jsx(b,{children:t.jsx(o,{})})})})]},F=o=>{const{selectRowsWithFlashDiff:d}=l.useContext(T),[h,x]=l.useState([]),[a,u]=l.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",distance:10},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",distance:null}]),f=l.useMemo(()=>[p({field:"id",headerName:"Id"}),c({field:"name",headerName:"Text input"},{multiEdit:!0,editorParams:{required:!0,maxLength:12,placeholder:"Enter some text...",invalid:e=>e==="never"?"The value 'never' is not allowed":null,onSave:async({selectedRows:e,value:n})=>(await i(1e3),e.forEach(r=>r.name=n),!0)}}),c({field:"distance",headerName:"Number input",valueFormatter:e=>{const n=e.data?.distance;return n!=null?`${n}${e.colDef.cellEditorParams.units}`:"–"}},{multiEdit:!1,editorParams:{maxLength:12,placeholder:"Enter distance...",units:"m",invalid:e=>e.length&&!E(e)?"Value must be a number":null,onSave:async({selectedRows:e,value:n})=>(await i(1e3),e.forEach(r=>r.distance=n.length?parseFloat(n):null),!0)}}),I({field:"plan",headerName:"Text area"},{multiEdit:!0,editorParams:{required:!0,maxLength:32,placeholder:"Enter some text...",invalid:e=>e==="never"?"The value 'never' is not allowed":null,onSave:async({selectedRows:e,value:n})=>(await i(1e3),e.forEach(r=>r.plan=n),!0)}}),G({colId:"plan2",field:"plan",headerName:"Multi-editor"},e=>e.rowIndex==0?m({multiEdit:!0,editor:g,editorParams:{required:!0,maxLength:32,placeholder:"Enter some text..."}}):m({multiEdit:!1,editor:R,editorParams:{options:[{label:"One",value:1}]}})),P({headerName:""},{multiEdit:!0,editorParams:{options:()=>[{label:"Delete",action:async({selectedRows:e})=>{await i(1e3),u(a.filter(n=>!e.some(r=>r.id==n.id)))}}]}})],[a]),v=l.useCallback(async()=>{await i(1e3);const e=a[a.length-1];await d(async()=>{u([...a,{id:(e?.id??0)+1,name:"?",nameType:"?",numba:"?",plan:"",distance:null,bold:!1}])})},[a,d]);return t.jsxs(t.Fragment,{children:[t.jsx(w,{...o,externalSelectedItems:h,setExternalSelectedItems:x,columnDefs:f,rowData:a,domLayout:"autoHeight",defaultColDef:{minWidth:70},sizeColumns:"auto",onBulkEditingComplete:()=>{console.log("onBulkEditingComplete()")}}),t.jsx(y,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:v})]})},s=F.bind({});s.play=C;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
  const {
    selectRowsWithFlashDiff
  } = useContext(GridContext);
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const [rowData, setRowData] = useState([{
    id: 1000,
    name: 'IS IS DP12345',
    nameType: 'IS',
    numba: 'IX',
    plan: 'DP 12345',
    distance: 10
  }, {
    id: 1001,
    name: 'PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523',
    distance: null
  }] as IFormTestRow[]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridPopoverTextInput({
    field: 'name',
    headerName: 'Text input'
  }, {
    multiEdit: true,
    editorParams: {
      required: true,
      maxLength: 12,
      placeholder: 'Enter some text...',
      invalid: (value: string) => {
        if (value === 'never') return "The value 'never' is not allowed";
        return null;
      },
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(selectedRow => selectedRow['name'] = value);
        return true;
      }
    }
  }), GridPopoverTextInput({
    field: 'distance',
    headerName: 'Number input',
    valueFormatter: params => {
      const v = params.data?.distance;
      return v != null ? \`\${v}\${params.colDef.cellEditorParams.units}\` : '–';
    }
  }, {
    multiEdit: false,
    editorParams: {
      maxLength: 12,
      placeholder: 'Enter distance...',
      units: 'm',
      invalid: (value: string) => {
        if (value.length && !isFloat(value)) return 'Value must be a number';
        return null;
      },
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(selectedRow => selectedRow['distance'] = value.length ? parseFloat(value) : null);
        return true;
      }
    }
  }), GridPopoverTextArea({
    field: 'plan',
    headerName: 'Text area'
  }, {
    multiEdit: true,
    editorParams: {
      required: true,
      maxLength: 32,
      placeholder: 'Enter some text...',
      invalid: (value: string) => {
        if (value === 'never') return "The value 'never' is not allowed";
        return null;
      },
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(selectedRow => selectedRow['plan'] = value);
        return true;
      }
    }
  }), GridCellMultiEditor({
    colId: 'plan2',
    field: 'plan',
    headerName: 'Multi-editor'
  }, _params => _params.rowIndex == 0 ? Editor({
    multiEdit: true,
    editor: GridFormTextArea,
    editorParams: {
      required: true,
      maxLength: 32,
      placeholder: 'Enter some text...'
    }
  }) : Editor({
    multiEdit: false,
    editor: GridFormDropDown,
    editorParams: {
      options: [{
        label: 'One',
        value: 1
      }]
    }
  })), GridPopoverMenu({
    headerName: ''
  }, {
    multiEdit: true,
    editorParams: {
      options: () => [{
        label: 'Delete',
        action: async ({
          selectedRows
        }) => {
          await wait(1000);
          setRowData(rowData.filter(data => !selectedRows.some(row => row.id == data.id)));
        }
      }]
    }
  })], [rowData]);
  const addRowAction = useCallback(async () => {
    await wait(1000);
    const lastRow = rowData[rowData.length - 1];
    // eslint-disable-next-line @typescript-eslint/require-await
    await selectRowsWithFlashDiff(async () => {
      setRowData([...rowData, {
        id: (lastRow?.id ?? 0) + 1,
        name: '?',
        nameType: '?',
        numba: '?',
        plan: '',
        distance: null,
        bold: false
      }]);
    });
  }, [rowData, selectRowsWithFlashDiff]);
  return <>
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} defaultColDef={{
      minWidth: 70
    }} sizeColumns={'auto'} onBulkEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log('onBulkEditingComplete()');
    }} />
      <ActionButton icon={'ic_add'} name={'Add new row'} inProgressName={'Adding...'} onClick={addRowAction} />
    </>;
}`,...s.parameters?.docs?.source}}};const X=["_EditGenericTextArea"];export{s as _EditGenericTextArea,X as __namedExportsOrder,H as default};
