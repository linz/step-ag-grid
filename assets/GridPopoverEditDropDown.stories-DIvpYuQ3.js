import{j as o,w as a}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as l}from"./iframe-fuNulc0f.js";import{M as h,p as d,G as v,b as O,c as S,d as P,e as T,f as x,g as D,o as E,q as F,i as G,j as C}from"./GridWrapper-BAUk9ZaG.js";import{G as p}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as n}from"./GridPopoverEditDropDown-dEHPrwAZ.js";import{G as I,a as g}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as j}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const z={title:"Components / Grids",component:p,args:{quickFilterValue:"",selectable:!0},decorators:[r=>o.jsx("div",{style:{width:1224,height:400},children:o.jsx(I,{children:o.jsx(g,{children:o.jsx(r,{})})})})]},R=r=>{const[m,b]=l.useState([]),c=l.useCallback(async(e,t)=>(console.log("optionsFn selected rows",e,t),t=t?.toLowerCase(),await a(1e3),[null,"Architect","Developer","Product Owner","Scrum Master","Tester",h,"Custom"].filter(u=>t!=null?u!=null&&u.toLowerCase().indexOf(t)===0:!0).map(d)),[]),s=l.useMemo(()=>[{code:"O1",desc:"Object One"},{code:"O2",desc:"Object Two"}],[]),f=l.useMemo(()=>[v({field:"id",headerName:"Id"}),n({field:"position2",headerName:"Multi-edit",singleClickEdit:!0},{multiEdit:!0,editorParams:{options:[E("Header"),{value:"1",label:"One",disabled:"Disabled for test"},{value:"2",label:"Two"},F,{value:"3",label:"Three"}]}}),n({field:"position3",headerName:"Custom callback"},{multiEdit:!0,editorParams:{options:[null,"Architect","Developer","Product Owner","Scrum Master","Tester"].map(d),onSelectedItem:async e=>{await a(2e3),e.selectedRows.forEach(t=>{t.position3=e.value})}}}),n({field:"position",headerName:"Options Fn"},{multiEdit:!1,editorParams:{filtered:"reload",filterPlaceholder:"Search me...",options:c}}),n({colId:"position3filtered",field:"position3",headerName:"Filtered",editable:!1},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:[null,"Architect","Developer","Product Owner","Scrum Master","Tester"].map(d)}}),n({field:"position4",headerName:"Filtered (object)",valueGetter:({data:e})=>e?.position4?.desc},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:s.map(e=>({value:e,label:e.desc,disabled:!1}))}}),n({field:"code",headerName:"Filter Selectable"},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",filterHelpText:"Press enter to save custom value",options:s.map(e=>({value:e.code,label:e.desc,disabled:!1})),onSelectedItem:e=>{console.log("onSelectedItem selected",e),e.selectedRows.forEach(t=>{t.code=e.value})},onSelectFilter:e=>{console.log("onSelectFilter selected",e),e.selectedRows.forEach(t=>{t.code=e.value})}}}),n({field:"sub",headerName:"Subcomponent",valueGetter:({data:e})=>e?.sub},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:()=>[{value:"one",label:"One"},{value:"two",label:"Two"},{value:"oth",label:"Other text input",subComponent:()=>o.jsx(G,{placeholder:"Other...",defaultValue:"a",required:!0})},{value:"oth",label:"Other text area",subComponent:()=>o.jsx(C,{placeholder:"Other...",defaultValue:"b",required:!0})}],onSelectedItem:async e=>{console.log("onSelectedItem",e),await a(500),e.selectedRows.forEach(t=>t.sub=e.subComponentValue??e.value)}}}),O({},{editorParams:{options:()=>[{label:"Hello",action:async()=>{}}]}})],[c,s]),[w]=l.useState([{id:1e3,position:"Tester",position2:"1",position3:"Tester",position4:{code:"O1",desc:"Object One"},code:"O1",sub:"two"},{id:1001,position:"Developer",position2:"2",position3:"Developer",position4:{code:"O2",desc:"Object Two"},code:"O2",sub:"one"},{id:1002,position:"Scrum Master",position2:"2",position3:"Architect",position4:{code:"O2",desc:"Object Two"},code:"O2",sub:"one"}]);return o.jsxs(S,{maxHeight:300,children:[o.jsxs(P,{children:[o.jsx(T,{}),o.jsx(x,{}),o.jsx(D,{fileName:"customFilename"})]}),o.jsx(p,{...r,externalSelectedIds:m,setExternalSelectedIds:b,columnDefs:f,rowData:w,domLayout:"autoHeight",onBulkEditingComplete:()=>{console.log("onBulkEditingComplete()")},onCellFocused:({colDef:e,data:t})=>{console.log("on cell focused called",{colDef:e,data:t})}})]})},i=R.bind({});i.play=j;i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedIds, setExternalSelectedIds] = useState<number[]>([]);
  const optionsFn = useCallback(async (selectedRows: ITestRow[], filter?: string) => {
    // eslint-disable-next-line no-console
    console.log('optionsFn selected rows', selectedRows, filter);
    filter = filter?.toLowerCase();
    await wait(1000);
    return [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester', MenuSeparatorString, 'Custom'].filter(v => filter != null ? v != null && v.toLowerCase().indexOf(filter) === 0 : true).map(primitiveToSelectOption);
  }, []);
  const optionsObjects = useMemo(() => [{
    code: 'O1',
    desc: 'Object One'
  }, {
    code: 'O2',
    desc: 'Object Two'
  }], []);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridPopoverEditDropDown<ITestRow, ITestRow['position2']>({
    field: 'position2',
    headerName: 'Multi-edit',
    singleClickEdit: true
  }, {
    multiEdit: true,
    editorParams: {
      options: [MenuHeaderItem('Header'), {
        value: '1',
        label: 'One',
        disabled: 'Disabled for test'
      }, {
        value: '2',
        label: 'Two'
      }, MenuSeparator, {
        value: '3',
        label: 'Three'
      }]
    }
  }), GridPopoverEditDropDown<ITestRow, ITestRow['position3'], string | null>({
    field: 'position3',
    headerName: 'Custom callback'
  }, {
    multiEdit: true,
    editorParams: {
      options: [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester'].map(primitiveToSelectOption),
      onSelectedItem: async selected => {
        await wait(2000);
        selected.selectedRows.forEach(row => {
          row.position3 = selected.value;
        });
      }
    }
  }), GridPopoverEditDropDown<ITestRow, ITestRow['position3'], string | null>({
    field: 'position',
    headerName: 'Options Fn'
  }, {
    multiEdit: false,
    editorParams: {
      filtered: 'reload',
      filterPlaceholder: 'Search me...',
      options: optionsFn
    }
  }), GridPopoverEditDropDown({
    colId: 'position3filtered',
    field: 'position3',
    headerName: 'Filtered',
    editable: false
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      options: [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester'].map(primitiveToSelectOption)
    }
  }), GridPopoverEditDropDown({
    field: 'position4',
    headerName: 'Filtered (object)',
    valueGetter: ({
      data
    }) => data?.position4?.desc
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      options: optionsObjects.map(o => {
        return {
          value: o,
          label: o.desc,
          disabled: false
        };
      })
    }
  }), GridPopoverEditDropDown<ITestRow, ITestRow['code'], string | null>({
    field: 'code',
    headerName: 'Filter Selectable'
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      filterHelpText: 'Press enter to save custom value',
      options: optionsObjects.map(o => {
        return {
          value: o.code,
          label: o.desc,
          disabled: false
        };
      }),
      onSelectedItem: selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectedItem selected', selected);
        selected.selectedRows.forEach(row => {
          row.code = selected.value;
        });
      },
      onSelectFilter: selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectFilter selected', selected);
        selected.selectedRows.forEach(row => {
          row.code = selected.value;
        });
      }
    }
  }), GridPopoverEditDropDown({
    field: 'sub',
    headerName: 'Subcomponent',
    valueGetter: ({
      data
    }) => data?.sub
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      options: () => {
        return [{
          value: 'one',
          label: 'One'
        }, {
          value: 'two',
          label: 'Two'
        }, {
          value: 'oth',
          label: 'Other text input',
          subComponent: () => <GridFormSubComponentTextInput placeholder={'Other...'} defaultValue={'a'} required={true} />
        }, {
          value: 'oth',
          label: 'Other text area',
          subComponent: () => <GridFormSubComponentTextArea placeholder={'Other...'} defaultValue={'b'} required={true} />
        }];
      },
      onSelectedItem: async selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectedItem', selected);
        await wait(500);
        selected.selectedRows.forEach(row => row.sub = selected.subComponentValue ?? selected.value);
      }
    }
  }), GridPopoverMenu({}, {
    editorParams: {
      options: () => [{
        label: 'Hello',
        action: async () => {}
      }]
    }
  })], [optionsFn, optionsObjects]);
  const [rowData] = useState([{
    id: 1000,
    position: 'Tester',
    position2: '1',
    position3: 'Tester',
    position4: {
      code: 'O1',
      desc: 'Object One'
    },
    code: 'O1',
    sub: 'two'
  }, {
    id: 1001,
    position: 'Developer',
    position2: '2',
    position3: 'Developer',
    position4: {
      code: 'O2',
      desc: 'Object Two'
    },
    code: 'O2',
    sub: 'one'
  }, {
    id: 1002,
    position: 'Scrum Master',
    position2: '2',
    position3: 'Architect',
    position4: {
      code: 'O2',
      desc: 'Object Two'
    },
    code: 'O2',
    sub: 'one'
  }] as ITestRow[]);
  return <GridWrapper maxHeight={300}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'customFilename'} />
      </GridFilters>
      <Grid {...props} externalSelectedIds={externalSelectedIds} setExternalSelectedIds={setExternalSelectedIds} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} onBulkEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log('onBulkEditingComplete()');
    }} onCellFocused={({
      colDef,
      data
    }) => {
      /* eslint-disable-next-line no-console */
      console.log('on cell focused called', {
        colDef,
        data
      });
    }} />
    </GridWrapper>;
}`,...i.parameters?.docs?.source}}};const J=["EditDropdown"];export{i as EditDropdown,J as __namedExportsOrder,z as default};
