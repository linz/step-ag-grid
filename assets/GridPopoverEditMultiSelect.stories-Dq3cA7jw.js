import{j as a}from"./jsx-runtime-QvZ8i92b.js";/* empty css                  */import{G as x,a as E}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{r as d}from"./index-uubelm5h.js";import{G as v,n as P,j as G,f as V,v as c}from"./GridWrapper-DJOqlb4b.js";import{G as h}from"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import{c as M,w as m,i as f}from"./util-BMTC4KOK.js";import"./ActionButton-CKl6PlbN.js";import{w as A}from"./storybookTestUtil-DTBDRQ8t.js";import"./index-BsSOpHTy.js";import"./index-U6Do-Xt6.js";const b=(r,i)=>v(r,{editor:P,...i,editorParams:{...i.editorParams,className:M("GridMultiSelect-containerMedium",i.editorParams?.className)}}),q={title:"Components / Grids",component:h,args:{quickFilterValue:"",selectable:!0},decorators:[r=>a.jsx("div",{style:{width:1024,height:400},children:a.jsx(x,{children:a.jsx(E,{children:a.jsx(r,{})})})})]},C=r=>{const[i,w]=d.useState([]),L=d.useMemo(()=>{const u={lot1:"Lot 1",lot2:"Lot 2",lot3:"Lot 3",lot4:"Lot A 482392",appA:"A",appB:"B",other:"Other"};return[v({field:"id",headerName:"Id"}),b({field:"position",headerName:"Position",valueFormatter:({value:e})=>e==null?"":e.map(t=>u[t]??t).join(", ")},{multiEdit:!0,editorParams:{filtered:!0,filterPlaceholder:"Filter position",className:"GridMultiSelect-containerUnlimited",headers:[{header:"Header item"}],options:[{value:"lot1",label:"Lot 1"},{value:"lot2",label:"Lot 2"},{value:"lot3",label:"Lot 3"},{value:"lot11",label:"Lot 11"},{value:"lot4",label:"Lot A 482392"},{value:"appA",label:"A"},{value:"appB",label:"B"},G,{value:"other",label:"Other",subComponent:()=>a.jsx(V,{required:!0,maxLength:5,defaultValue:""})}],onSave:async({selectedRows:e,selectedOptions:t})=>{console.log("multiSelect result",{selectedRows:e,selectedOptions:t}),await m(1e3);const[n,l]=c(t,o=>o.subComponent),p=[...l.map(o=>o.value),...n.map(o=>o.subValue)];return e.forEach(o=>o.position=p),!0}}}),b({field:"position",headerName:"Parcel picker",valueFormatter:({value:e})=>e==null?"":e.map(t=>u[t]??t).join(", ")},{multiEdit:!0,editorParams:{filtered:!0,filterPlaceholder:"Filter/add custom parcel...",filterHelpText:(e,t)=>f(e)||t.find(n=>n.label&&n.label.toLowerCase()===e.toLowerCase())?void 0:"Press enter to add free text",onSelectFilter:async({filter:e,options:t})=>{f(e)||t.find(n=>n.label&&n.label.toLowerCase()===e.toLowerCase())||t.push({value:e,label:e,filter:"freeText",checked:!0})},className:"GridMultiSelect-containerLarge",headers:[{header:"Free text",filter:"freeText"},{header:"Parcels"}],options:e=>{const t=e[0],n=[{value:"lot1",label:"Lot 1"},{value:"lot2",label:"Lot 2",warning:"Don't select me"},{value:"lot3",label:"Lot 3"},{value:"lot11",label:"Lot 11"},{value:"lot4",label:"Lot A 482392"},{value:"appA",label:"A"},{value:"appB",label:"B"}].map(l=>({...l,checked:t.position?.includes(l.value)}));return t.position?.forEach(l=>!(l in u)&&n.push({value:l,label:l,checked:!0,filter:"freeText"})),n},onSave:async({selectedRows:e,selectedOptions:t})=>{console.log("multiSelect result",{selectedRows:e,selectedOptions:t}),await m(1e3);const[n,l]=c(t,o=>o.subComponent),p=[...l.map(o=>o.value),...n.map(o=>o.subValue)];return e.forEach(o=>o.position=p),!0}}})]},[]),[S]=d.useState([{id:1e3,position:["lot1","lot2"],position2:"lot1",position3:"Tester"},{id:1001,position:["appA"],position2:"lot2",position3:"Developer"}]);return a.jsx(h,{...r,animateRows:!0,externalSelectedItems:i,setExternalSelectedItems:w,columnDefs:L,rowData:S,domLayout:"autoHeight"})},s=C.bind({});s.play=A;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
    const positionMap: Record<string, string> = {
      lot1: "Lot 1",
      lot2: "Lot 2",
      lot3: "Lot 3",
      lot4: "Lot A 482392",
      appA: "A",
      appB: "B",
      other: "Other"
    };
    return [GridCell({
      field: "id",
      headerName: "Id"
    }), GridPopoutEditMultiSelect<ITestRow, ITestRow["position"]>({
      field: "position",
      headerName: "Position",
      valueFormatter: ({
        value
      }) => {
        if (value == null) return "";
        return value.map((v: string) => positionMap[v] ?? v).join(", ");
      }
    }, {
      multiEdit: true,
      editorParams: {
        filtered: true,
        filterPlaceholder: "Filter position",
        className: "GridMultiSelect-containerUnlimited",
        headers: [{
          header: "Header item"
        }],
        options: [{
          value: "lot1",
          label: "Lot 1"
        }, {
          value: "lot2",
          label: "Lot 2"
        }, {
          value: "lot3",
          label: "Lot 3"
        }, {
          value: "lot11",
          label: "Lot 11"
        }, {
          value: "lot4",
          label: "Lot A 482392"
        }, {
          value: "appA",
          label: "A"
        }, {
          value: "appB",
          label: "B"
        }, MenuSeparator, {
          value: "other",
          label: "Other",
          subComponent: () => <GridFormSubComponentTextArea required={true} maxLength={5} defaultValue={""} />
        }],
        onSave: async ({
          selectedRows,
          selectedOptions
        }) => {
          // eslint-disable-next-line no-console
          console.log("multiSelect result", {
            selectedRows,
            selectedOptions
          });
          await wait(1000);
          const [subValues, normalValues] = partition(selectedOptions, o => o.subComponent);
          const newValue = [...normalValues.map(o => o.value), ...subValues.map(o => o.subValue)];
          selectedRows.forEach(row => row.position = newValue);
          return true;
        }
      }
    }), GridPopoutEditMultiSelect<ITestRow, ITestRow["position"]>({
      field: "position",
      headerName: "Parcel picker",
      valueFormatter: ({
        value
      }) => {
        if (value == null) return "";
        return value.map((v: string) => positionMap[v] ?? v).join(", ");
      }
    }, {
      multiEdit: true,
      editorParams: {
        filtered: true,
        filterPlaceholder: "Filter/add custom parcel...",
        filterHelpText: (filter, options) => isEmpty(filter) || options.find(o => o.label && o.label.toLowerCase() === filter.toLowerCase()) ? undefined : "Press enter to add free text",
        onSelectFilter: async ({
          filter,
          options
        }) => {
          if (isEmpty(filter) || options.find(o => o.label && o.label.toLowerCase() === filter.toLowerCase())) return;
          options.push({
            value: filter,
            label: filter,
            filter: "freeText",
            checked: true
          });
        },
        className: "GridMultiSelect-containerLarge",
        headers: [{
          header: "Free text",
          filter: "freeText"
        }, {
          header: "Parcels"
        }],
        options: selectedRows => {
          const firstRow = selectedRows[0];
          const r: MultiSelectOption[] = [{
            value: "lot1",
            label: "Lot 1"
          }, {
            value: "lot2",
            label: "Lot 2",
            warning: "Don't select me"
          }, {
            value: "lot3",
            label: "Lot 3"
          }, {
            value: "lot11",
            label: "Lot 11"
          }, {
            value: "lot4",
            label: "Lot A 482392"
          }, {
            value: "appA",
            label: "A"
          }, {
            value: "appB",
            label: "B"
          }].map(r => ({
            ...r,
            checked: firstRow.position?.includes(r.value)
          }));
          firstRow.position?.forEach(p => !(p in positionMap) && r.push({
            value: p,
            label: p,
            checked: true,
            filter: "freeText"
          }));
          return r;
        },
        onSave: async ({
          selectedRows,
          selectedOptions
        }) => {
          // eslint-disable-next-line no-console
          console.log("multiSelect result", {
            selectedRows,
            selectedOptions
          });
          await wait(1000);
          const [subValues, normalValues] = partition(selectedOptions, o => o.subComponent);
          const newValue = [...normalValues.map(o => o.value), ...subValues.map(o => o.subValue)];
          selectedRows.forEach(row => row.position = newValue);
          return true;
        }
      }
    })];
  }, []);
  const [rowData] = useState(([{
    id: 1000,
    position: ["lot1", "lot2"],
    position2: "lot1",
    position3: "Tester"
  }, {
    id: 1001,
    position: ["appA"],
    position2: "lot2",
    position3: "Developer"
  }] as ITestRow[]));
  return <Grid {...props} animateRows={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} />;
}`,...s.parameters?.docs?.source}}};const U=["EditMultiSelect"];export{s as EditMultiSelect,U as __namedExportsOrder,q as default};
