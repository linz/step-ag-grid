import{j as t}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as E,a as I}from"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{r as c}from"./index-RYns6xqu.js";import{G as w}from"./GridWrapper-DSHsENPw.js";import{g as k,G as x}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{a as D,b as G,f as R,c as P}from"./util-CWqzvxZb.js";import"./ActionButton-BnaFCZwL.js";import{w as v}from"./storybookTestUtil-CYGWFEhE.js";import"./index-8uelxQvJ.js";const y=e=>{const{data:o,node:i,column:n,colDef:a,api:l}=e,r=c.useRef(null);return c.useEffect(()=>{const s=d=>{d.rowIndex===i.rowIndex&&d.column===n&&r.current?.focus()};return l.addEventListener("cellFocused",s),()=>{l.removeEventListener("cellFocused",s)}},[l,n,i.rowIndex]),t.jsx(D,{ref:r,className:"lui-button-icon-only",size:"sm",level:"text",onClick:()=>{const s=[o],d=s.map(p=>p.id);a?.cellEditorParams.onClick?.({selectedRows:s,selectedRowIds:d})},style:{display:a?.cellEditorParams?.visible?.(e)!==!1?"":"none"},children:t.jsx(G,{name:"ic_redo",alt:"revert",size:"md"})})},S=(e,o)=>w({minWidth:72,maxWidth:72,resizable:!1,headerClass:"GridHeaderAlignCenter",cellClass:"GridCellAlignCenter",cellRenderer:y,cellEditorParams:{...o},...e}),g=e=>{const{onValueChange:o,value:i,api:n,node:a,column:l,colDef:r,data:s}=e,d=c.useRef(null);c.useEffect(()=>{const f=u=>{u.rowIndex===a.rowIndex&&u.column===l&&d.current?.focus()};return n.addEventListener("cellFocused",f),()=>{n.removeEventListener("cellFocused",f)}},[n,l,a.rowIndex]);const p=!R(r?.editable,e);return t.jsx("div",{className:P("ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper",{"ag-checked":e.value,"ag-disabled":p}),children:t.jsx("input",{type:"checkbox",className:"ag-input-field-input ag-checkbox-input",disabled:p,ref:d,checked:i,onChange:()=>{},onClick:f=>{if(f.stopPropagation(),!o)return;const u=e?.colDef?.cellEditorParams;if(!u)return;const C=[];n.forEachNode(h=>{h.data.id===s.id&&C.push(h.data)});const b=!i;o(b),u.onClick({selectedRows:C,selectedRowIds:C.map(h=>h.id),checked:b}).then()}})})},B=(e,o)=>w({minWidth:64,maxWidth:64,cellRenderer:g,cellEditor:g,cellEditorParams:o,onCellClicked:k,singleClickEdit:!0,resizable:!1,editable:!0,cellClass:"GridCellAlignCenter",headerClass:"GridHeaderAlignCenter",...e}),X={title:"Components / Grids",component:x,decorators:[e=>t.jsx("div",{style:{width:1024,height:400},children:t.jsx(E,{children:t.jsx(I,{children:t.jsx(e,{})})})})]},j=()=>{const[e,o]=c.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",bold:!0},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",bold:!1}]),i=c.useMemo(()=>[w({field:"id",headerName:"Id"}),S({colId:"button",headerName:"Button"},{visible:({data:n})=>!!(n.id&1),onClick:({selectedRowIds:n})=>{alert("click "+n)}}),B({field:"bold"},{onClick:async({selectedRowIds:n,checked:a})=>(o(l=>(console.log("onchange",n,a),l.map(r=>n.includes(r.id)?{...r,bold:a}:r))),!0)})],[]);return t.jsx(x,{columnDefs:i,rowData:e,selectable:!1,singleClickEdit:!0,rowSelection:"single",domLayout:"autoHeight"})},m=j.bind({});m.play=v;m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [rowData, setRowData] = useState([{
    id: 1000,
    name: "IS IS DP12345",
    nameType: "IS",
    numba: "IX",
    plan: "DP 12345",
    bold: true
  }, {
    id: 1001,
    name: "PEG V SD523",
    nameType: "PEG",
    numba: "V",
    plan: "SD 523",
    bold: false
  }] as IFormTestRow[]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridButton({
    colId: "button",
    headerName: "Button"
  }, {
    visible: ({
      data
    }) => !!(data.id & 1),
    onClick: ({
      selectedRowIds
    }) => {
      alert("click " + selectedRowIds);
    }
  }), GridEditBoolean({
    field: "bold"
  }, {
    onClick: async ({
      selectedRowIds,
      checked
    }) => {
      setRowData(rowData => {
        // eslint-disable-next-line no-console
        console.log("onchange", selectedRowIds, checked);
        return rowData.map(row => selectedRowIds.includes(row.id) ? {
          ...row,
          bold: checked
        } : row);
      });
      return true;
    }
  })], []);
  return <Grid columnDefs={columnDefs} rowData={rowData} selectable={false} singleClickEdit={true} rowSelection="single" domLayout={"autoHeight"} />;
}`,...m.parameters?.docs?.source}}};const U=["_EditBoolean"];export{m as _EditBoolean,U as __namedExportsOrder,X as default};
