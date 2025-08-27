import{j as e,w as g}from"./util-D0ZPQILD.js";/* empty css                  */import{G as p,a as u}from"./GridUpdatingContextProvider-Bf3uDJXf.js";import"./stateDeferredHook-CMmLGC-b.js";import{r as a}from"./iframe-DFgdmXXt.js";import{G as b,a as G,b as f,c as x,m as C,n as w}from"./GridWrapper-Dkr6AhEe.js";import{G as t}from"./Grid-Cl0RwgNy.js";import{G as E,a as h}from"./GridPopoverEditBearing-xWpTIvGp.js";import"./ActionButton-BhkOzu5T.js";import{w as v}from"./storybookTestUtil-D13wlVSp.js";import"./index-CGwqqGm4.js";import"./preload-helper-Ct5FWWRu.js";const k={title:"Components / Grids",component:t,args:{quickFilterValue:"",selectable:!0,alwaysShowVerticalScroll:!1},decorators:[i=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(p,{children:e.jsx(u,{children:e.jsx(i,{})})})})]},S=i=>{const[o,s]=a.useState([]),d=a.useMemo(()=>[b({field:"id",headerName:"Id"}),E({field:"bearingCorrection",headerName:"Bearing correction",cellRendererParams:{warning:({data:r})=>r?.id==1002&&"Testers are testing",info:({data:r})=>r?.id==1001&&"Developers are developing"}},{}),h({field:"bearing",headerName:"Bearing"},{editorParams:{onSave:async({selectedRows:r,value:c})=>(await g(1e3),r.forEach(m=>m.bearing=c),!0)}})],[]),[l]=a.useState([{id:1e3,bearing:1.234,bearingCorrection:null},{id:1001,bearing:"0E-12",bearingCorrection:240},{id:1002,bearing:null,bearingCorrection:355.1},{id:1003,bearing:null,bearingCorrection:0},{id:1004,bearing:5,bearingCorrection:"1.00500"},{id:1005,bearing:null,bearingCorrection:"0E-12"}]);return e.jsxs(G,{maxHeight:300,children:[e.jsxs(f,{children:[e.jsx(x,{}),e.jsx(C,{}),e.jsx(w,{fileName:"customFilename"})]}),e.jsx(t,{"data-testid":"bearingsTestTable",...i,readOnly:!1,externalSelectedItems:o,setExternalSelectedItems:s,columnDefs:d,rowData:l,domLayout:"autoHeight"})]})},n=S.bind({});n.play=v;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridPopoverEditBearingCorrection({
    field: 'bearingCorrection',
    headerName: 'Bearing correction',
    cellRendererParams: {
      warning: ({
        data
      }) => data?.id == 1002 && 'Testers are testing',
      info: ({
        data
      }) => data?.id == 1001 && 'Developers are developing'
    }
  }, {
    multiEdit: false
  }), GridPopoverEditBearing({
    field: 'bearing',
    headerName: 'Bearing'
  }, {
    editorParams: {
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(row => row['bearing'] = value);
        return true;
      }
    }
  })], []);
  const [rowData] = useState([{
    id: 1000,
    bearing: 1.234,
    bearingCorrection: null
  }, {
    id: 1001,
    bearing: '0E-12',
    bearingCorrection: 240
  }, {
    id: 1002,
    bearing: null,
    bearingCorrection: 355.1
  }, {
    id: 1003,
    bearing: null,
    bearingCorrection: 0
  }, {
    id: 1004,
    bearing: 5.0,
    bearingCorrection: '1.00500'
  }, {
    id: 1005,
    bearing: null,
    bearingCorrection: '0E-12'
  }] as ITestRow[]);
  return <GridWrapper maxHeight={300}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'customFilename'} />
      </GridFilters>
      <Grid data-testid={'bearingsTestTable'} {...props} readOnly={false} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} />
    </GridWrapper>;
}`,...n.parameters?.docs?.source}}};const O=["_GridPopoverEditBearing"];export{n as _GridPopoverEditBearing,O as __namedExportsOrder,k as default};
