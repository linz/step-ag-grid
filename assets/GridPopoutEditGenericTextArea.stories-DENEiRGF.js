import{j as t}from"./index-uvRZkhe0.js";/* empty css                  */import{G as E,a as D}from"./GridUpdatingContextProvider-B593SlzE.js";import"./stateDeferredHook-Dh_hbzWK.js";import{r as i}from"./index-DQDNmYQF.js";import{G as p,B as G,C as P,e as g,E as m,h as R,m as S}from"./GridWrapper-BvIPk76g.js";import{G as w,b as T}from"./Grid-DelFEA_-.js";import{w as l,i as I}from"./util-BM2a4RZN.js";import{G as C}from"./GridPopoverTextArea-DhLtKSbL.js";import{A as b}from"./ActionButton-CiYuM8e0.js";import{w as y}from"./storybookTestUtil-DBFt3sMW.js";import"./index-DYVtDik4.js";import"./index-BFcdsecu.js";const c=(o,d)=>p(o,{editor:G,...d}),z={title:"Components / Grids",component:w,args:{quickFilterValue:"",selectable:!0},decorators:[o=>t.jsx("div",{style:{width:1024,height:400},children:t.jsx(E,{children:t.jsx(D,{children:t.jsx(o,{})})})})]},F=o=>{const{selectRowsWithFlashDiff:d}=i.useContext(T),[h,f]=i.useState([]),[a,u]=i.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",distance:10},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",distance:null}]),x=i.useMemo(()=>[p({field:"id",headerName:"Id"}),c({field:"name",headerName:"Text input"},{multiEdit:!0,editorParams:{required:!0,maxLength:12,placeholder:"Enter some text...",invalid:e=>e==="never"?"The value 'never' is not allowed":null,onSave:async({selectedRows:e,value:n})=>(await l(1e3),e.forEach(r=>r.name=n),!0)}}),c({field:"distance",headerName:"Number input",valueFormatter:e=>{const n=e.data?.distance;return n!=null?`${n}${e.colDef.cellEditorParams.units}`:"–"}},{multiEdit:!1,editorParams:{maxLength:12,placeholder:"Enter distance...",units:"m",invalid:e=>e.length&&!I(e)?"Value must be a number":null,onSave:async({selectedRows:e,value:n})=>(await l(1e3),e.forEach(r=>r.distance=n.length?parseFloat(n):null),!0)}}),C({field:"plan",headerName:"Text area"},{multiEdit:!0,editorParams:{required:!0,maxLength:32,placeholder:"Enter some text...",invalid:e=>e==="never"?"The value 'never' is not allowed":null,onSave:async({selectedRows:e,value:n})=>(await l(1e3),e.forEach(r=>r.plan=n),!0)}}),P({colId:"plan2",field:"plan",headerName:"Multi-editor"},e=>e.rowIndex==0?m({multiEdit:!0,editor:R,editorParams:{required:!0,maxLength:32,placeholder:"Enter some text..."}}):m({multiEdit:!1,editor:S,editorParams:{options:[{label:"One",value:1}]}})),g({headerName:""},{multiEdit:!0,editorParams:{options:()=>[{label:"Delete",action:async({selectedRows:e})=>{await l(1e3),u(a.filter(n=>!e.some(r=>r.id==n.id)))}}]}})],[a]),v=i.useCallback(async()=>{await l(1e3);const e=a[a.length-1];await d(async()=>{u([...a,{id:(e?.id??0)+1,name:"?",nameType:"?",numba:"?",plan:"",distance:null,bold:!1}])})},[a,d]);return t.jsxs(t.Fragment,{children:[t.jsx(w,{...o,externalSelectedItems:h,setExternalSelectedItems:f,columnDefs:x,rowData:a,domLayout:"autoHeight",defaultColDef:{minWidth:70},sizeColumns:"auto",onCellEditingComplete:()=>{console.log("Cell editing complete")}}),t.jsx(b,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:v})]})},s=F.bind({});s.play=y;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps) => {
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
    }} sizeColumns={'auto'} onCellEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log('Cell editing complete');
    }} />
      <ActionButton icon={'ic_add'} name={'Add new row'} inProgressName={'Adding...'} onClick={addRowAction} />
    </>;
}`,...s.parameters?.docs?.source}}};const H=["_EditGenericTextArea"];export{s as _EditGenericTextArea,H as __namedExportsOrder,z as default};
