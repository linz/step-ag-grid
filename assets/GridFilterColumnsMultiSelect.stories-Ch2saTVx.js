import{j as s,a as h}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{G as p,c as F,d as b,e as x,h as D}from"./GridWrapper-BAUk9ZaG.js";import{c as G}from"./client-DUEhelG0.js";import{r as g}from"./iframe-fuNulc0f.js";import{G as f}from"./Grid-CF0nfSDW.js";import{G as T,a as M}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as E}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const l="__EMPTY__",m="-",v=({allValues:a,selected:e,labels:i,labelFormatter:t,onToggleAll:n,onToggleOne:c})=>{const u=a.length>0&&e.size===a.length,C=r=>{const d=r===l?i[l]??m:i[r]??r;return t?t(d):d};return s.jsxs("div",{className:"GridFilterColsMultiSelect",children:[s.jsx("span",{className:"LuiSelect-label-text",children:"Filter column"}),s.jsx(h,{className:"LuiCheckboxInput-selectAll",label:"Select All",value:"true",isChecked:u,onChange:r=>n(r.target.checked)}),a.map(r=>s.jsx(h,{className:"LuiCheckboxInput-item",label:C(r),value:r,isChecked:e.has(r),onChange:d=>c(r,d.target.checked)},r))]})};class w{params;selectedValues=new Set;labels={};allValues=[];gui;labelFormatter;reactRoot=null;normalizeCellValue(e){return typeof e=="string"?e.trim()===""?l:e:l}loadFieldValues(){const e=this.params.colDef.field,i=new Set;return this.params.api.forEachNode(t=>{const c=(t.data??{})[e],u=this.normalizeCellValue(c);i.add(u)}),Array.from(i).sort((t,n)=>t===l&&n!==l?-1:n===l&&t!==l?1:t.localeCompare(n))}init(e){this.params=e,this.labels={...e.labels},this.labelFormatter=e.labelFormatter,l in this.labels||(this.labels[l]=m),this.allValues=this.loadFieldValues(),this.selectedValues=new Set(this.allValues),this.gui=document.createElement("div"),this.reactRoot=G.createRoot(this.gui),this.render()}render(){this.reactRoot&&this.reactRoot.render(s.jsx(v,{allValues:this.allValues,selected:this.selectedValues,labels:this.labels,labelFormatter:this.labelFormatter,onToggleAll:this.handleToggleAll.bind(this),onToggleOne:this.handleToggleOne.bind(this)}))}handleToggleAll(e){e?this.allValues.forEach(i=>this.selectedValues.add(i)):this.selectedValues.clear(),this.render(),this.params.filterChangedCallback()}handleToggleOne(e,i){i?this.selectedValues.add(e):this.selectedValues.delete(e),this.render(),this.params.filterChangedCallback()}getGui(){return this.gui}isFilterActive(){return this.selectedValues.size>0}doesFilterPass(e){const i=this.params.colDef.field;if(!e.data||typeof e.data!="object")return this.selectedValues.has(l);const t=e.data[i],n=this.normalizeCellValue(t);return this.selectedValues.has(n)}getModel(){return this.selectedValues.size>0?{values:Array.from(this.selectedValues)}:null}setModel(e){this.selectedValues=new Set(e?.values||[]),this.render()}destroy(){this.reactRoot&&(this.reactRoot.unmount(),this.reactRoot=null)}}const k=(a={},e)=>({labels:{[l]:m,...a},labelFormatter:e}),Y={title:"Components / Grids",component:f,decorators:[a=>s.jsx("div",{style:{width:1024,height:400,display:"flex"},children:s.jsx(T,{children:s.jsx(M,{children:s.jsx(a,{})})})})]},V=a=>{const e=g.useMemo(()=>[p({field:"id",headerName:"Id"}),p({field:"position",headerName:"Position",filter:w,filterParams:k({Developer:"FE Dev",Manager:"Tech Manager",__EMPTY__:"None"})}),p({field:"desc",headerName:"Description",flex:1})],[]),[i]=g.useState([{id:1e3,position:"Tester",age:30,desc:"Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien."},{id:1001,position:"Developer",age:12,desc:"Frontend developer"},{id:1002,position:"Manager",age:65,desc:"Technical Manager"},{id:1003,position:"Tester",age:30,desc:"E2E tester"},{id:1004,age:12,desc:"Fullstack Developer"},{id:1005,position:"Developer",age:13,desc:"Backend Developer"},{id:1006,position:"Architect",age:30,desc:"Architect"}]);return s.jsxs(F,{children:[s.jsxs(b,{children:[s.jsx(x,{quickFilterPlaceholder:"Custom placeholder..."}),s.jsx(D,{luiButtonProps:{style:{whiteSpace:"nowrap"}},options:[{label:"All"},{label:"Developers",filter:t=>t.position==="Developer"},{label:"Testers",filter:t=>t.position==="Tester"}]})]}),s.jsx(f,{...a,rowSelection:"multiple",columnDefs:e,rowData:i,sizeColumns:"auto-skip-headers"})]})},o=V.bind({});o.play=E;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridCell({
    field: 'position',
    headerName: 'Position',
    filter: GridFilterColumnsMultiSelect,
    filterParams: createCheckboxMultiFilterParams({
      Developer: 'FE Dev',
      Manager: 'Tech Manager',
      __EMPTY__: 'None'
    })
  }), GridCell({
    field: 'desc',
    headerName: 'Description',
    flex: 1
  })], []);
  const [rowData] = useState([{
    id: 1000,
    position: 'Tester',
    age: 30,
    desc: 'Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien.'
  }, {
    id: 1001,
    position: 'Developer',
    age: 12,
    desc: 'Frontend developer'
  }, {
    id: 1002,
    position: 'Manager',
    age: 65,
    desc: 'Technical Manager'
  }, {
    id: 1003,
    position: 'Tester',
    age: 30,
    desc: 'E2E tester'
  }, {
    id: 1004,
    age: 12,
    desc: 'Fullstack Developer'
  }, {
    id: 1005,
    position: 'Developer',
    age: 13,
    desc: 'Backend Developer'
  }, {
    id: 1006,
    position: 'Architect',
    age: 30,
    desc: 'Architect'
  }]);
  return <GridWrapper>
      <GridFilters>
        <GridFilterQuick quickFilterPlaceholder={'Custom placeholder...'} />
        <GridFilterButtons<ITestRow> luiButtonProps={{
        style: {
          whiteSpace: 'nowrap'
        }
      }} options={[{
        label: 'All'
      }, {
        label: 'Developers',
        filter: row => row.position === 'Developer'
      }, {
        label: 'Testers',
        filter: row => row.position === 'Tester'
      }]} />
      </GridFilters>
      <Grid {...props} rowSelection={'multiple'} columnDefs={columnDefs} rowData={rowData} sizeColumns={'auto-skip-headers'} />
    </GridWrapper>;
}`,...o.parameters?.docs?.source}}};const O=["_FilterColumnsMultiSelectExample"];export{o as _FilterColumnsMultiSelectExample,O as __namedExportsOrder,Y as default};
