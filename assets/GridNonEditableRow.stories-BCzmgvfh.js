import{j as t}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as w,a as b}from"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{G as g}from"./GridPopoverEditDropDown-DBh-V0XY.js";import{G as h}from"./GridPopoverTextArea-B2COVri8.js";import{r as i}from"./index-RYns6xqu.js";import{G as l,e as x,f as D}from"./GridWrapper-DSHsENPw.js";import{G as d}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{w as n}from"./util-CWqzvxZb.js";import{G as S}from"./GridPopoverMenu-Yd4tcYyA.js";import"./ActionButton-BnaFCZwL.js";import{w as G}from"./storybookTestUtil-CYGWFEhE.js";import"./GridFormTextArea-WR3il2kX.js";import"./GridFormPopoverMenu-D5EUowsz.js";import"./index-8uelxQvJ.js";const _={title:"Components / Grids",component:d,args:{selectable:!0,rowSelection:"single",autoSelectFirstRow:!0},decorators:[r=>t.jsx("div",{style:{width:1024,height:400},children:t.jsx(w,{children:t.jsx(b,{children:t.jsx(r,{})})})})]},y=r=>{const[c,m]=i.useState([]),p=i.useMemo(()=>[l({field:"id",headerName:"Id"}),g({field:"position",headerName:"Position"},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter",options:["Architect","Developer","Product Owner","Scrum Master","Tester"]}}),l({field:"age",headerName:"Age"}),h({field:"desc",headerName:"Description"},{}),S({},{multiEdit:!0,editorParams:{options:async a=>(await n(500),[{label:"Single edit only",action:async({selectedRows:e})=>{alert(`Single-edit: ${e.map(s=>s.id)} rowId(s) selected`),await n(1500)},disabled:a.length>1},{label:"Multi-edit",action:async({selectedRows:e})=>{alert(`Multi-edit: ${e.map(s=>s.id)} rowId(s) selected`),await n(1500)}},{label:"Disabled item",disabled:"Disabled for test"},{label:"Developer Only",hidden:a.some(e=>e.position!="Developer")},{label:"Other (TextInput)",action:async({menuOption:e})=>{console.log(`Sub selected value was ${JSON.stringify(e.subValue)}`),await n(500)},subComponent:()=>t.jsx(x,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})},{label:"Other (TextArea)",action:async({menuOption:e})=>{console.log(`Sub selected value was ${JSON.stringify(e.subValue)}`),await n(500)},subComponent:()=>t.jsx(D,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})}])}})],[]),[u]=i.useState([{id:1e3,position:"Tester",age:30,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,desc:"Manages",dd:"3"}]),f=i.useMemo(()=>({editable:({data:a})=>a?.position!=="Manager"}),[]);return t.jsx(d,{...r,externalSelectedItems:c,setExternalSelectedItems:m,defaultColDef:f,columnDefs:p,rowData:u,domLayout:"autoHeight"})},o=y.bind({});o.play=G;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridPopoverEditDropDown({
    field: "position",
    headerName: "Position"
  }, {
    multiEdit: true,
    editorParams: {
      filtered: "local",
      filterPlaceholder: "Filter",
      options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester"]
    }
  }), GridCell({
    field: "age",
    headerName: "Age"
  }), GridPopoverTextArea({
    field: "desc",
    headerName: "Description"
  }, {}), GridPopoverMenu({}, {
    multiEdit: true,
    editorParams: {
      options: async selectedItems => {
        // Just doing a timeout here to demonstrate deferred loading
        await wait(500);
        return [{
          label: "Single edit only",
          action: async ({
            selectedRows
          }) => {
            alert(\`Single-edit: \${selectedRows.map(r => r.id)} rowId(s) selected\`);
            await wait(1500);
          },
          disabled: selectedItems.length > 1
        }, {
          label: "Multi-edit",
          action: async ({
            selectedRows
          }) => {
            alert(\`Multi-edit: \${selectedRows.map(r => r.id)} rowId(s) selected\`);
            await wait(1500);
          }
        }, {
          label: "Disabled item",
          disabled: "Disabled for test"
        }, {
          label: "Developer Only",
          hidden: selectedItems.some(x => x.position != "Developer")
        }, {
          label: "Other (TextInput)",
          action: async ({
            menuOption
          }) => {
            // eslint-disable-next-line no-console
            console.log(\`Sub selected value was \${JSON.stringify(menuOption.subValue)}\`);
            await wait(500);
          },
          subComponent: () => <GridFormSubComponentTextInput placeholder={"Other"} maxLength={5} required defaultValue={""} />
        }, {
          label: "Other (TextArea)",
          action: async ({
            menuOption
          }) => {
            // eslint-disable-next-line no-console
            console.log(\`Sub selected value was \${JSON.stringify(menuOption.subValue)}\`);
            await wait(500);
          },
          subComponent: () => <GridFormSubComponentTextArea placeholder={"Other"} maxLength={5} required defaultValue={""} />
        }] as MenuOption<ITestRow>[];
      }
    }
  })], []);
  const [rowData] = useState([{
    id: 1000,
    position: "Tester",
    age: 30,
    desc: "Tests application",
    dd: "1"
  }, {
    id: 1001,
    position: "Developer",
    age: 12,
    desc: "Develops application",
    dd: "2"
  }, {
    id: 1002,
    position: "Manager",
    age: 65,
    desc: "Manages",
    dd: "3"
  }]);
  const defaultColDef: ColDefT<ITestRow> = useMemo(() => ({
    editable: ({
      data
    }) => data?.position !== "Manager"
  }), []);
  return <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} defaultColDef={defaultColDef} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} />;
}`,...o.parameters?.docs?.source}}};const q=["_NonEditableRow"];export{o as _NonEditableRow,q as __namedExportsOrder,_ as default};
