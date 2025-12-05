import{j as e,w as m}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as a}from"./iframe-fuNulc0f.js";import{G as p,c as u,d as b,e as G,f,g as x}from"./GridWrapper-BAUk9ZaG.js";import{G as t}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{a as C,b as w}from"./GridPopoverEditBearing-yDM-0OA5.js";import{G as E,a as h}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as v}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const W={title:"Components / Grids",component:t,args:{quickFilterValue:"",selectable:!0,alwaysShowVerticalScroll:!1},decorators:[i=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(E,{children:e.jsx(h,{children:e.jsx(i,{})})})})]},S=i=>{const[o,d]=a.useState([]),s=a.useMemo(()=>[p({field:"id",headerName:"Id"}),C({field:"bearingCorrection",headerName:"Bearing correction",cellRendererParams:{warning:({data:r})=>r?.id==1002&&"Testers are testing",info:({data:r})=>r?.id==1001&&"Developers are developing"}},{}),w({field:"bearing",headerName:"Bearing"},{editorParams:{onSave:async({selectedRows:r,value:c})=>(await m(1e3),r.forEach(g=>g.bearing=c),!0)}})],[]),[l]=a.useState([{id:1e3,bearing:1.234,bearingCorrection:null},{id:1001,bearing:"0E-12",bearingCorrection:240},{id:1002,bearing:null,bearingCorrection:355.1},{id:1003,bearing:null,bearingCorrection:0},{id:1004,bearing:5,bearingCorrection:"1.00500"},{id:1005,bearing:null,bearingCorrection:"0E-12"}]);return e.jsxs(u,{maxHeight:300,children:[e.jsxs(b,{children:[e.jsx(G,{}),e.jsx(f,{}),e.jsx(x,{fileName:"customFilename"})]}),e.jsx(t,{"data-testid":"bearingsTestTable",...i,readOnly:!1,externalSelectedIds:o,setExternalSelectedIds:d,columnDefs:s,rowData:l,domLayout:"autoHeight"})]})},n=S.bind({});n.play=v;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedIds, setExternalSelectedIds] = useState<number[]>([]);
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
      <Grid data-testid={'bearingsTestTable'} {...props} readOnly={false} externalSelectedIds={externalSelectedIds} setExternalSelectedIds={setExternalSelectedIds} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} />
    </GridWrapper>;
}`,...n.parameters?.docs?.source}}};const L=["_GridPopoverEditBearing"];export{n as _GridPopoverEditBearing,L as __namedExportsOrder,W as default};
