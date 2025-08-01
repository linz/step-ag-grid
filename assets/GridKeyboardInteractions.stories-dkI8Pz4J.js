import{j as a,w as i}from"./util-Bgyi09Ip.js";/* empty css                  */import{G as v,a as y}from"./GridUpdatingContextProvider-Cm1Mh2ke.js";import"./stateDeferredHook-D_TYtWjH.js";import{r as g}from"./iframe-DxqxLvC4.js";import{G as l,e as b,A as T,f as G,g as S}from"./GridWrapper-BpIAkRfq.js";import{G as x}from"./Grid-VK9dZD2m.js";import{G as C}from"./GridPopoverMessage-BDN9V0Q6.js";import"./ActionButton-BukOjtns.js";import{w as D}from"./storybookTestUtil-D13wlVSp.js";import"./index-CG3c8ksy.js";import"./preload-helper-Ct5FWWRu.js";const{expect:n}=__STORYBOOK_MODULE_TEST__,{fn:f}=__STORYBOOK_MODULE_TEST__,{userEvent:t,waitFor:c}=__STORYBOOK_MODULE_TEST__,K={title:"Components / Grids",component:x,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[r=>a.jsx("div",{style:{width:1024,height:400},children:a.jsx(v,{children:a.jsx(y,{children:a.jsx(r,{})})})})]},h=f(async()=>{console.log("multiEditAction"),await i(500)}),m=f(()=>(console.log("eAction"),!0)),E=r=>{const[s,o]=g.useState([]),u=g.useMemo(()=>[l({field:"id",headerName:"Id"}),l({field:"position",headerName:"Position",cellRendererParams:{warning:({value:e})=>e==="Tester"&&"Testers are testing",info:({value:e})=>e==="Developer"&&"Developers are awesome"}}),l({field:"age",headerName:"Age"}),l({field:"desc",headerName:"Description"}),C({headerName:"Popout message",maxWidth:150,cellRenderer:()=>a.jsx(a.Fragment,{children:"Single Click me!"})},{multiEdit:!0,editorParams:{message:async e=>(await i(1e3),`There are ${e.length} row(s) selected`)}}),l({headerName:"Custom edit",maxWidth:100,editable:!0,valueFormatter:()=>"Press E",cellRendererParams:{rightHoverElement:a.jsx(T,{icon:"ic_launch_modal",title:"Title text",className:"GridCell-editableIcon"}),editAction:()=>{},shortcutKeys:{e:m}}}),b({},{multiEdit:!0,editorParams:{defaultAction:({menuOption:e})=>{console.log("clicked",{menuOption:e})},options:async e=>(await i(50),[{label:"Single edit only",action:async()=>{},disabled:e.length>1},{label:"Multi-edit",action:h},{label:"Disabled item",disabled:"Disabled for test"},{label:"Developer Only",hidden:e.some(w=>w.position!="Developer")},{label:"Other (TextInput)",action:async()=>{},subComponent:()=>a.jsx(G,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})},{label:"Other (TextArea)",action:async({menuOption:w})=>{console.log(`Sub selected value was ${JSON.stringify(w.subValue)}`),await i(500)},subComponent:()=>a.jsx(S,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})}])}}),b({editable:()=>!1},{editorParams:{options:()=>[]}})],[]),[p]=g.useState([{id:1e3,position:"Tester",age:30,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,desc:"Manages",dd:"3"}]);return a.jsx(x,{...r,selectable:!0,externalSelectedItems:s,setExternalSelectedItems:o,columnDefs:u,rowData:p,domLayout:"autoHeight",autoSelectFirstRow:!0})},d=E.bind({});d.play=async({canvasElement:r})=>{h.mockClear(),m.mockClear(),await D({canvasElement:r}),await c(()=>{const o=r.ownerDocument.activeElement;n(o).toHaveClass("ag-cell-focus"),n(o).toHaveAttribute("aria-colindex","1"),n(o?.parentElement).toHaveAttribute("row-index","0")}),await t.keyboard("{arrowdown}{arrowdown}"),await t.keyboard("{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}");const s=async(o,u,p)=>{await t.keyboard("{Enter}"),await i(1e3),await t.keyboard("{arrowdown}{arrowdown}"),o(),await c(()=>{n(h).toHaveBeenCalled()}),await c(()=>{const e=r.ownerDocument.activeElement;n(e).toHaveClass("ag-cell-focus"),n(e).toHaveAttribute("aria-colindex",u),n(e?.parentElement).toHaveAttribute("row-index",p)}),await i(200)};await s(()=>t.keyboard("{Enter}"),"8","2"),await s(()=>t.tab(),"9","2"),await t.tab({shift:!0}),await s(()=>t.tab({shift:!0}),"6","2"),await t.keyboard("{Esc}"),await t.tab(),await t.keyboard("{Enter}"),await i(250),n(m).not.toHaveBeenCalled(),await t.keyboard("e"),await c(()=>{n(m).toHaveBeenCalled()})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridCell<ITestRow, ITestRow['position']>({
    field: 'position',
    headerName: 'Position',
    cellRendererParams: {
      warning: ({
        value
      }) => value === 'Tester' && 'Testers are testing',
      info: ({
        value
      }) => value === 'Developer' && 'Developers are awesome'
    }
  }), GridCell({
    field: 'age',
    headerName: 'Age'
  }), GridCell({
    field: 'desc',
    headerName: 'Description'
  }), GridPopoverMessage({
    headerName: 'Popout message',
    maxWidth: 150,
    cellRenderer: () => <>Single Click me!</>
  }, {
    multiEdit: true,
    editorParams: {
      message: async (selectedRows): Promise<string> => {
        await wait(1000);
        return \`There are \${selectedRows.length} row(s) selected\`;
      }
    }
  }), GridCell({
    headerName: 'Custom edit',
    maxWidth: 100,
    editable: true,
    valueFormatter: () => 'Press E',
    cellRendererParams: {
      rightHoverElement: <GridIcon icon={'ic_launch_modal'} title={'Title text'} className={'GridCell-editableIcon'} />,
      editAction: () => {
        //
      },
      shortcutKeys: {
        e: eAction
      }
    }
  }), GridPopoverMenu({}, {
    multiEdit: true,
    editorParams: {
      defaultAction: ({
        menuOption
      }) => {
        // eslint-disable-next-line no-console
        console.log('clicked', {
          menuOption
        });
      },
      options: async selectedItems => {
        // Just doing a timeout here to demonstrate deferred loading
        await wait(50);
        return [{
          label: 'Single edit only',
          action: async () => {
            //
          },
          disabled: selectedItems.length > 1
        }, {
          label: 'Multi-edit',
          action: multiEditAction
        }, {
          label: 'Disabled item',
          disabled: 'Disabled for test'
        }, {
          label: 'Developer Only',
          hidden: selectedItems.some(x => x.position != 'Developer')
        }, {
          label: 'Other (TextInput)',
          action: async () => {
            //
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
  }), GridPopoverMenu({
    editable: () => false
  }, {
    editorParams: {
      options: () => []
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
  return <Grid {...props} selectable={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} autoSelectFirstRow={true} />;
}`,...d.parameters?.docs?.source}}};const L=["GridKeyboardInteractions"];export{d as GridKeyboardInteractions,L as __namedExportsOrder,K as default};
