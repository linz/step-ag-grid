import{j as a}from"./jsx-runtime-QvZ8i92b.js";/* empty css                  */import{G,a as D}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{r as l}from"./index-uubelm5h.js";import{G as m,w as P,x as g,k as R}from"./GridWrapper-DJOqlb4b.js";import{G as w,b as C}from"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import{w as s,f as S}from"./util-BMTC4KOK.js";import{G as T}from"./GridFormTextArea-BpCinh5A.js";import{G as I}from"./GridPopoverMenu-YA2473GL.js";import{G as y}from"./GridPopoverTextArea-DDg36WfS.js";import{G as b}from"./GridFormTextInput-Dcs3CXlU.js";import{A as F}from"./ActionButton-CKl6PlbN.js";import{w as A}from"./storybookTestUtil-DTBDRQ8t.js";import"./GridFormPopoverMenu-ZxOdRx-U.js";import"./index-BsSOpHTy.js";import"./index-U6Do-Xt6.js";const c=t=>({component:g(t.editor),params:{...t.editorParams,multiEdit:t.multiEdit}}),N=(t,i)=>m({cellClassRules:P,cellEditorSelector:i,editable:t.editable??!0,...t}),p=(t,i)=>m(t,{editor:b,...i}),Z={title:"Components / Grids",component:w,args:{quickFilterValue:"",selectable:!0},decorators:[t=>a.jsx("div",{style:{width:1024,height:400},children:a.jsx(G,{children:a.jsx(D,{children:a.jsx(t,{})})})})]},_=t=>{const{selectRowsWithFlashDiff:i}=l.useContext(C),[h,f]=l.useState([]),[r,u]=l.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",distance:10},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",distance:null}]),x=l.useMemo(()=>[m({field:"id",headerName:"Id"}),p({field:"name",headerName:"Text input"},{multiEdit:!0,editorParams:{required:!0,maxLength:12,placeholder:"Enter some text...",invalid:e=>e==="never"?"The value 'never' is not allowed":null,onSave:async({selectedRows:e,value:n})=>(await s(1e3),e.forEach(o=>o.name=n),!0)}}),p({field:"distance",headerName:"Number input",valueFormatter:e=>{const n=e.data?.distance;return n!=null?`${n}${e.colDef.cellEditorParams.units}`:"–"}},{multiEdit:!1,editorParams:{maxLength:12,placeholder:"Enter distance...",units:"m",invalid:e=>e.length&&!S(e)?"Value must be a number":null,onSave:async({selectedRows:e,value:n})=>(await s(1e3),e.forEach(o=>o.distance=n.length?parseFloat(n):null),!0)}}),y({field:"plan",headerName:"Text area"},{multiEdit:!0,editorParams:{required:!0,maxLength:32,placeholder:"Enter some text...",invalid:e=>e==="never"?"The value 'never' is not allowed":null,onSave:async({selectedRows:e,value:n})=>(await s(1e3),e.forEach(o=>o.plan=n),!0)}}),N({colId:"plan2",field:"plan",headerName:"Multi-editor"},e=>e.rowIndex==0?c({multiEdit:!0,editor:T,editorParams:{required:!0,maxLength:32,placeholder:"Enter some text..."}}):c({multiEdit:!1,editor:R,editorParams:{options:[{label:"One",value:1}]}})),I({headerName:""},{multiEdit:!0,editorParams:{options:async e=>[{label:"Delete",action:async({selectedRows:n})=>{await s(1e3),u(r.filter(o=>!n.some(E=>E.id==o.id)))}}]}})],[r]),v=l.useCallback(async()=>{await s(1e3);const e=r[r.length-1];await i(async()=>{u([...r,{id:(e?.id??0)+1,name:"?",nameType:"?",numba:"?",plan:"",distance:null}])})},[r,i]);return a.jsxs(a.Fragment,{children:[a.jsx(w,{...t,externalSelectedItems:h,setExternalSelectedItems:f,columnDefs:x,rowData:r,domLayout:"autoHeight",defaultColDef:{minWidth:70},sizeColumns:"auto",onCellEditingComplete:()=>{console.log("Cell editing complete")}}),a.jsx(F,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:v})]})},d=_.bind({});d.play=A;d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const {
    selectRowsWithFlashDiff
  } = useContext(GridContext);
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const [rowData, setRowData] = useState(([{
    id: 1000,
    name: "IS IS DP12345",
    nameType: "IS",
    numba: "IX",
    plan: "DP 12345",
    distance: 10
  }, {
    id: 1001,
    name: "PEG V SD523",
    nameType: "PEG",
    numba: "V",
    plan: "SD 523",
    distance: null
  }] as IFormTestRow[]));
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridPopoverTextInput({
    field: "name",
    headerName: "Text input"
  }, {
    multiEdit: true,
    editorParams: {
      required: true,
      maxLength: 12,
      placeholder: "Enter some text...",
      invalid: (value: string) => {
        if (value === "never") return "The value 'never' is not allowed";
        return null;
      },
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(selectedRow => selectedRow["name"] = value);
        return true;
      }
    }
  }), GridPopoverTextInput({
    field: "distance",
    headerName: "Number input",
    valueFormatter: params => {
      const v = params.data?.distance;
      return v != null ? \`\${v}\${params.colDef.cellEditorParams.units}\` : "–";
    }
  }, {
    multiEdit: false,
    editorParams: {
      maxLength: 12,
      placeholder: "Enter distance...",
      units: "m",
      invalid: (value: string) => {
        if (value.length && !isFloat(value)) return "Value must be a number";
        return null;
      },
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(selectedRow => selectedRow["distance"] = value.length ? parseFloat(value) : null);
        return true;
      }
    }
  }), GridPopoverTextArea({
    field: "plan",
    headerName: "Text area"
  }, {
    multiEdit: true,
    editorParams: {
      required: true,
      maxLength: 32,
      placeholder: "Enter some text...",
      invalid: (value: string) => {
        if (value === "never") return "The value 'never' is not allowed";
        return null;
      },
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(selectedRow => selectedRow["plan"] = value);
        return true;
      }
    }
  }), GridCellMultiEditor({
    colId: "plan2",
    field: "plan",
    headerName: "Multi-editor"
  }, _params => _params.rowIndex == 0 ? Editor({
    multiEdit: true,
    editor: GridFormTextArea,
    editorParams: {
      required: true,
      maxLength: 32,
      placeholder: "Enter some text..."
    }
  }) : Editor({
    multiEdit: false,
    editor: GridFormDropDown,
    editorParams: {
      options: [{
        label: "One",
        value: 1
      }]
    }
  })), GridPopoverMenu({
    headerName: ""
  }, {
    multiEdit: true,
    editorParams: {
      options: async _ => [{
        label: "Delete",
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
    await selectRowsWithFlashDiff(async () => {
      setRowData([...rowData, {
        id: (lastRow?.id ?? 0) + 1,
        name: "?",
        nameType: "?",
        numba: "?",
        plan: "",
        distance: null
      }]);
    });
  }, [rowData, selectRowsWithFlashDiff]);
  return <>
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} defaultColDef={{
      minWidth: 70
    }} sizeColumns={"auto"} onCellEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log("Cell editing complete");
    }} />
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onClick={addRowAction} />
    </>;
}`,...d.parameters?.docs?.source}}};const ee=["_EditGenericTextArea"];export{d as _EditGenericTextArea,ee as __namedExportsOrder,Z as default};
