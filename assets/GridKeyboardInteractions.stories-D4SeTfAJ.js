import{j as a}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as y,a as v}from"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{f as x,a as c,e as n,u as t}from"./index-8uelxQvJ.js";import{r as h}from"./index-RYns6xqu.js";import{G as l,l as G,e as C,f as D}from"./GridWrapper-y58xtKL0.js";import{G as f}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{w as i}from"./util-CWqzvxZb.js";import{G as g}from"./GridPopoverMenu-Dgdhx-D_.js";import{G as I}from"./GridPopoverMessage-C0p4TuPP.js";import"./ActionButton-BnaFCZwL.js";import{w as S}from"./storybookTestUtil-CYGWFEhE.js";import"./GridFormPopoverMenu-DyaAWYt_.js";import"./GridFormMessage-B0-Z9GkP.js";const W={title:"Components / Grids",component:f,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[r=>a.jsx("div",{style:{width:1024,height:400},children:a.jsx(y,{children:a.jsx(v,{children:a.jsx(r,{})})})})]},b=x(async()=>{await i(500)}),m=x(()=>!0),P=r=>{const[s,o]=h.useState([]),u=h.useMemo(()=>[l({field:"id",headerName:"Id"}),l({field:"position",headerName:"Position",cellRendererParams:{warning:({value:e})=>e==="Tester"&&"Testers are testing",info:({value:e})=>e==="Developer"&&"Developers are awesome"}}),l({field:"age",headerName:"Age"}),l({field:"desc",headerName:"Description"}),I({headerName:"Popout message",maxWidth:150,cellRenderer:()=>a.jsx(a.Fragment,{children:"Single Click me!"})},{multiEdit:!0,editorParams:{message:async e=>(await i(1e3),`There are ${e.length} row(s) selected`)}}),l({headerName:"Custom edit",maxWidth:100,editable:!0,valueFormatter:()=>"Press E",cellRendererParams:{rightHoverElement:a.jsx(G,{icon:"ic_launch_modal",title:"Title text",className:"GridCell-editableIcon"}),editAction:()=>{},shortcutKeys:{e:m}}}),g({},{multiEdit:!0,editorParams:{defaultAction:async({menuOption:e})=>{console.log("clicked",{menuOption:e})},options:async e=>(await i(500),[{label:"Single edit only",action:async()=>{},disabled:e.length>1},{label:"Multi-edit",action:b},{label:"Disabled item",disabled:"Disabled for test"},{label:"Developer Only",hidden:e.some(w=>w.position!="Developer")},{label:"Other (TextInput)",action:async()=>{},subComponent:()=>a.jsx(C,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})},{label:"Other (TextArea)",action:async({menuOption:w})=>{console.log(`Sub selected value was ${JSON.stringify(w.subValue)}`),await i(500)},subComponent:()=>a.jsx(D,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})}])}}),g({editable:()=>!1},{editorParams:{options:async()=>[]}})],[]),[p]=h.useState([{id:1e3,position:"Tester",age:30,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,desc:"Manages",dd:"3"}]);return a.jsx(f,{...r,selectable:!0,externalSelectedItems:s,setExternalSelectedItems:o,columnDefs:u,rowData:p,domLayout:"autoHeight",autoSelectFirstRow:!0})},d=P.bind({});d.play=async({canvasElement:r})=>{b.mockReset(),m.mockReset(),await S({canvasElement:r}),await c(async()=>{const o=r.ownerDocument.activeElement;n(o).toHaveClass("ag-cell-focus"),n(o).toHaveAttribute("aria-colindex","1"),n(o?.parentElement).toHaveAttribute("row-index","0")}),await t.keyboard("{arrowdown}{arrowdown}"),await t.keyboard("{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}");const s=async(o,u,p)=>{await t.keyboard("{Enter}"),await i(1e3),await t.keyboard("{arrowdown}{arrowdown}"),o(),await c(async()=>{n(b).toHaveBeenCalled()}),await c(async()=>{const e=r.ownerDocument.activeElement;n(e).toHaveClass("ag-cell-focus"),n(e).toHaveAttribute("aria-colindex",u),n(e?.parentElement).toHaveAttribute("row-index",p)}),await i(1e3)};await s(()=>t.keyboard("{Enter}"),"8","2"),await s(()=>t.tab(),"9","2"),await t.tab({shift:!0}),await s(()=>t.tab({shift:!0}),"6","2"),await t.keyboard("{Esc}"),await t.tab(),await t.keyboard("{Enter}"),await i(250),n(m).not.toHaveBeenCalled(),await t.keyboard("e"),await c(async()=>{n(m).toHaveBeenCalled()})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridCell<ITestRow, ITestRow["position"]>({
    field: "position",
    headerName: "Position",
    cellRendererParams: {
      warning: ({
        value
      }) => value === "Tester" && "Testers are testing",
      info: ({
        value
      }) => value === "Developer" && "Developers are awesome"
    }
  }), GridCell({
    field: "age",
    headerName: "Age"
  }), GridCell({
    field: "desc",
    headerName: "Description"
  }), GridPopoverMessage({
    headerName: "Popout message",
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
    headerName: "Custom edit",
    maxWidth: 100,
    editable: true,
    valueFormatter: () => "Press E",
    cellRendererParams: {
      rightHoverElement: <GridIcon icon={"ic_launch_modal"} title={"Title text"} className={"GridCell-editableIcon"} />,
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
      defaultAction: async ({
        menuOption
      }) => {
        // eslint-disable-next-line no-console
        console.log("clicked", {
          menuOption
        });
      },
      options: async selectedItems => {
        // Just doing a timeout here to demonstrate deferred loading
        await wait(500);
        return [{
          label: "Single edit only",
          action: async () => {
            //
          },
          disabled: selectedItems.length > 1
        }, {
          label: "Multi-edit",
          action: multiEditAction
        }, {
          label: "Disabled item",
          disabled: "Disabled for test"
        }, {
          label: "Developer Only",
          hidden: selectedItems.some(x => x.position != "Developer")
        }, {
          label: "Other (TextInput)",
          action: async () => {
            //
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
  }), GridPopoverMenu({
    editable: () => false
  }, {
    editorParams: {
      options: async () => {
        return [];
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
  return <Grid {...props} selectable={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} autoSelectFirstRow={true} />;
}`,...d.parameters?.docs?.source}}};const $=["GridKeyboardInteractions"];export{d as GridKeyboardInteractions,$ as __namedExportsOrder,W as default};
