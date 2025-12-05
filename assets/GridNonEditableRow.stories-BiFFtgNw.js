import{j as t,w as n}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{G as b}from"./GridPopoverEditDropDown-dEHPrwAZ.js";import{G as f}from"./GridPopoverTextArea-C2apFZQU.js";import{r as i}from"./iframe-fuNulc0f.js";import{G as l,b as g,p as h,i as x,j as S}from"./GridWrapper-BAUk9ZaG.js";import{G as d}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as D,a as G}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as v}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const J={title:"Components / Grids",component:d,args:{selectable:!0,rowSelection:"single",autoSelectFirstRow:!0},decorators:[r=>t.jsx("div",{style:{width:1024,height:400},children:t.jsx(D,{children:t.jsx(G,{children:t.jsx(r,{})})})})]},T=r=>{const[c,p]=i.useState([]),m=i.useMemo(()=>[l({field:"id",headerName:"Id"}),b({field:"position",headerName:"Position"},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter",options:["Architect","Developer","Product Owner","Scrum Master","Tester"].map(h)}}),l({field:"age",headerName:"Age"}),f({field:"desc",headerName:"Description"},{}),g({},{multiEdit:!0,editorParams:{options:async a=>(await n(500),[{label:"Single edit only",action:async({selectedRows:e})=>{alert(`Single-edit: ${e.map(s=>s.id).join()} rowId(s) selected`),await n(1500)},disabled:a.length>1},{label:"Multi-edit",action:async({selectedRows:e})=>{alert(`Multi-edit: ${e.map(s=>s.id).join()} rowId(s) selected`),await n(1500)}},{label:"Disabled item",disabled:"Disabled for test"},{label:"Developer Only",hidden:a.some(e=>e.position!="Developer")},{label:"Other (TextInput)",action:async({menuOption:e})=>{console.log(`Sub selected value was ${JSON.stringify(e.subValue)}`),await n(500)},subComponent:()=>t.jsx(x,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})},{label:"Other (TextArea)",action:async({menuOption:e})=>{console.log(`Sub selected value was ${JSON.stringify(e.subValue)}`),await n(500)},subComponent:()=>t.jsx(S,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})}])}})],[]),[u]=i.useState([{id:1e3,position:"Tester",age:30,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,desc:"Manages",dd:"3"}]),w=i.useMemo(()=>({editable:({data:a})=>a?.position!=="Manager"}),[]);return t.jsx(d,{...r,externalSelectedItems:c,setExternalSelectedItems:p,defaultColDef:w,columnDefs:m,rowData:u,domLayout:"autoHeight"})},o=T.bind({});o.play=v;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridPopoverEditDropDown({
    field: 'position',
    headerName: 'Position'
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter',
      options: ['Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester'].map(primitiveToSelectOption)
    }
  }), GridCell({
    field: 'age',
    headerName: 'Age'
  }), GridPopoverTextArea({
    field: 'desc',
    headerName: 'Description'
  }, {}), GridPopoverMenu({}, {
    multiEdit: true,
    editorParams: {
      options: async selectedItems => {
        // Just doing a timeout here to demonstrate deferred loading
        await wait(500);
        return [{
          label: 'Single edit only',
          action: async ({
            selectedRows
          }) => {
            alert(\`Single-edit: \${selectedRows.map(r => r.id).join()} rowId(s) selected\`);
            await wait(1500);
          },
          disabled: selectedItems.length > 1
        }, {
          label: 'Multi-edit',
          action: async ({
            selectedRows
          }) => {
            alert(\`Multi-edit: \${selectedRows.map(r => r.id).join()} rowId(s) selected\`);
            await wait(1500);
          }
        }, {
          label: 'Disabled item',
          disabled: 'Disabled for test'
        }, {
          label: 'Developer Only',
          hidden: selectedItems.some(x => x.position != 'Developer')
        }, {
          label: 'Other (TextInput)',
          action: async ({
            menuOption
          }) => {
            // eslint-disable-next-line no-console
            console.log(\`Sub selected value was \${JSON.stringify(menuOption.subValue)}\`);
            await wait(500);
          },
          subComponent: () => <GridFormSubComponentTextInput placeholder={'Other'} maxLength={5} required defaultValue={''} />
        }, {
          label: 'Other (TextArea)',
          action: async ({
            menuOption
          }) => {
            // eslint-disable-next-line no-console
            console.log(\`Sub selected value was \${JSON.stringify(menuOption.subValue)}\`);
            await wait(500);
          },
          subComponent: () => <GridFormSubComponentTextArea placeholder={'Other'} maxLength={5} required defaultValue={''} />
        }] as MenuOption<ITestRow>[];
      }
    }
  })], []);
  const [rowData] = useState([{
    id: 1000,
    position: 'Tester',
    age: 30,
    desc: 'Tests application',
    dd: '1'
  }, {
    id: 1001,
    position: 'Developer',
    age: 12,
    desc: 'Develops application',
    dd: '2'
  }, {
    id: 1002,
    position: 'Manager',
    age: 65,
    desc: 'Manages',
    dd: '3'
  }]);
  const defaultColDef: ColDefT<ITestRow> = useMemo(() => ({
    editable: ({
      data
    }) => data?.position !== 'Manager'
  }), []);
  return <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} defaultColDef={defaultColDef} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} />;
}`,...o.parameters?.docs?.source}}};const _=["_NonEditableRow"];export{o as _NonEditableRow,_ as __namedExportsOrder,J as default};
