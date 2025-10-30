import{j as t,L as u}from"./util-ijFjlinu.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{G as c,a as f,b as C,c as F,d as b}from"./GridWrapper-BPNz-Kwc.js";import{c as x}from"./client-iOTQfKt-.js";import{r as p}from"./iframe-DlkmCGKI.js";import{G as m}from"./Grid-x2Pv4IEw.js";import{G as D,a as G}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import{w as v}from"./storybookTestUtil-D13wlVSp.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const T=({allValues:l,selected:e,labels:i,labelFormatter:s,onToggleAll:a,onToggleOne:o})=>{const h=l.length>0&&e.size===l.length,g=r=>{const d=i[r]??r;return s?s(d):d};return t.jsxs("div",{className:"GridFilterColsMultiSelect",children:[t.jsx("span",{className:"LuiSelect-label-text",children:"Filter column"}),t.jsx(u,{className:"LuiCheckboxInput-selectAll",label:"Select All",value:"true",isChecked:h,onChange:r=>a(r.target.checked)}),l.map(r=>t.jsx(u,{className:"LuiCheckboxInput-item",label:g(r),value:r,isChecked:e.has(r),onChange:d=>o(r,d.target.checked)},r))]})};class k{params;selectedValues=new Set;labels={};allValues=[];gui;labelFormatter;reactRoot=null;loadFieldValues(){const e=this.params.colDef.field,i=new Set;return this.params.api.forEachNode(s=>{const a=s.data,o=a?.[e];a&&typeof a=="object"&&e in a&&typeof o=="string"&&o!==void 0&&o!==null&&i.add(o)}),Array.from(i).sort()}init(e){this.params=e,this.labels={...e.labels},this.labelFormatter=e.labelFormatter,this.allValues=this.loadFieldValues(),this.gui=document.createElement("div"),this.reactRoot=x.createRoot(this.gui),this.render()}render(){this.reactRoot&&this.reactRoot.render(t.jsx(T,{allValues:this.allValues,selected:this.selectedValues,labels:this.labels,labelFormatter:this.labelFormatter,onToggleAll:this.handleToggleAll.bind(this),onToggleOne:this.handleToggleOne.bind(this)}))}handleToggleAll(e){e?this.allValues.forEach(i=>this.selectedValues.add(i)):this.selectedValues.clear(),this.render(),this.params.filterChangedCallback()}handleToggleOne(e,i){i?this.selectedValues.add(e):this.selectedValues.delete(e),this.render(),this.params.filterChangedCallback()}getGui(){return this.gui}isFilterActive(){return this.selectedValues.size>0}doesFilterPass(e){const i=this.params.colDef.field;if(!e.data||typeof e.data!="object"||!(i in e.data))return!1;const s=e.data[i];return typeof s!="string"?!1:this.selectedValues.has(s)}getModel(){return this.selectedValues.size>0?{values:Array.from(this.selectedValues)}:null}setModel(e){this.selectedValues=new Set(e?.values||[]),this.render()}destroy(){this.reactRoot&&(this.reactRoot.unmount(),this.reactRoot=null)}}const w=(l={},e)=>({labels:l,labelFormatter:e}),z={title:"Components / Grids",component:m,decorators:[l=>t.jsx("div",{style:{width:1024,height:400,display:"flex"},children:t.jsx(D,{children:t.jsx(G,{children:t.jsx(l,{})})})})]},M=l=>{const e=p.useMemo(()=>[c({field:"id",headerName:"Id"}),c({field:"position",headerName:"Position",filter:k,filterParams:w({Developer:"FE Dev",Manager:"Tech Manager"})}),c({field:"desc",headerName:"Description",flex:1})],[]),[i]=p.useState([{id:1e3,position:"Tester",age:30,desc:"Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien."},{id:1001,position:"Developer",age:12,desc:"Frontend developer"},{id:1002,position:"Manager",age:65,desc:"Technical Manager"},{id:1003,position:"Tester",age:30,desc:"E2E tester"},{id:1004,position:"Developer",age:12,desc:"Fullstack Developer"},{id:1005,position:"Developer",age:13,desc:"Backend Developer"},{id:1006,position:"Architect",age:30,desc:"Architect"}]);return t.jsxs(f,{children:[t.jsxs(C,{children:[t.jsx(F,{quickFilterPlaceholder:"Custom placeholder..."}),t.jsx(b,{luiButtonProps:{style:{whiteSpace:"nowrap"}},options:[{label:"All"},{label:"Developers",filter:s=>s.position==="Developer"},{label:"Testers",filter:s=>s.position==="Tester"}]})]}),t.jsx(m,{...l,rowSelection:"multiple",columnDefs:e,rowData:i,sizeColumns:"auto-skip-headers"})]})},n=M.bind({});n.play=v;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridCell({
    field: 'position',
    headerName: 'Position',
    filter: GridFilterColumnsMultiSelect,
    filterParams: createCheckboxMultiFilterParams({
      Developer: 'FE Dev',
      Manager: 'Tech Manager'
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
    position: 'Developer',
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
}`,...n.parameters?.docs?.source}}};const _=["_FilterColumnsMultiSelectExample"];export{n as _FilterColumnsMultiSelectExample,_ as __namedExportsOrder,z as default};
