import{j as t}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as g,a as E}from"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{r as u}from"./index-RYns6xqu.js";import{G as f}from"./GridWrapper-y58xtKL0.js";import{g as I,G as b}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{a as k,b as D,c as G,f as R}from"./util-CWqzvxZb.js";import"./ActionButton-BnaFCZwL.js";import{w as P}from"./storybookTestUtil-CYGWFEhE.js";import"./index-8uelxQvJ.js";const v=e=>{const{data:o,node:s,column:n,colDef:l,api:r}=e,a=u.useRef(null);return u.useEffect(()=>{const i=d=>{d.rowIndex===s.rowIndex&&d.column===n&&a.current?.focus()};return r.addEventListener("cellFocused",i),()=>{r.removeEventListener("cellFocused",i)}},[r,n,s.rowIndex]),t.jsx(k,{ref:a,className:"lui-button-icon-only",size:"sm",level:"text",onClick:()=>{const i=[o],d=i.map(c=>c.id);l?.cellEditorParams.onClick?.({selectedRows:i,selectedRowIds:d})},style:{display:l?.cellEditorParams?.visible?.(e)!==!1?"":"none"},children:t.jsx(D,{name:"ic_redo",alt:"revert",size:"md"})})},y=(e,o)=>f({minWidth:72,maxWidth:72,resizable:!1,headerClass:"GridHeaderAlignCenter",cellClass:"GridCellAlignCenter",cellRenderer:v,cellEditorParams:{...o},...e}),w=e=>{const{onValueChange:o,value:s,api:n,node:l,column:r,colDef:a,data:i}=e,d=u.useRef(null);return u.useEffect(()=>{const c=m=>{m.rowIndex===l.rowIndex&&m.column===r&&d.current?.focus()};return n.addEventListener("cellFocused",c),()=>{n.removeEventListener("cellFocused",c)}},[n,r,l.rowIndex]),t.jsx("div",{className:G("ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper",{"ag-checked":e.value}),children:t.jsx("input",{type:"checkbox",className:"ag-input-field-input ag-checkbox-input",disabled:!R(a?.editable,e),ref:d,checked:s,onChange:()=>{},onClick:c=>{if(c.stopPropagation(),!o)return;const m=e?.colDef?.cellEditorParams;if(!m)return;const h=[i],C=!s;o(C),m.onClick({selectedRows:h,selectedRowIds:h.map(x=>x.id),checked:C}).then()}})})},S=(e,o)=>f({minWidth:64,maxWidth:64,cellRenderer:w,cellEditor:w,cellEditorParams:o,onCellClicked:I,singleClickEdit:!0,resizable:!1,editable:!0,cellClass:"GridCellAlignCenter",headerClass:"GridHeaderAlignCenter",...e}),O={title:"Components / Grids",component:b,decorators:[e=>t.jsx("div",{style:{width:1024,height:400},children:t.jsx(g,{children:t.jsx(E,{children:t.jsx(e,{})})})})]},B=()=>{const[e,o]=u.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",bold:!0},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",bold:!1}]),s=u.useMemo(()=>[f({field:"id",headerName:"Id"}),y({colId:"button",headerName:"Button"},{visible:({data:n})=>!!(n.id&1),onClick:({selectedRowIds:n})=>{alert("click "+n)}}),S({field:"bold"},{onClick:async({selectedRowIds:n,checked:l})=>(o(r=>(console.log("onchange",n,l),r.map(a=>n.includes(a.id)?{...a,bold:l}:a))),!0)})],[]);return t.jsx(b,{columnDefs:s,rowData:e,selectable:!1,singleClickEdit:!0,rowSelection:"single",domLayout:"autoHeight"})},p=B.bind({});p.play=P;p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};const X=["_EditBoolean"];export{p as _EditBoolean,X as __namedExportsOrder,O as default};
