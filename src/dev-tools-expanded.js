import React from "react";
import Dock from "react-dock";
import styled from "react-emotion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Subscribe } from "unstated";
import GlobalStateContainer from "./state/global";
import EditorStateContainer from "./state/editor";
import StateTab from "./tabs/state";
import HistoryTab from "./tabs/history";
import SchemaTab from "./tabs/schema";
import PluginsTab from "./tabs/plugins";
import StructureTab from "./tabs/structure";
import SnapshotsTab from "./tabs/snapshots";
import CSSReset from "./components/css-reset";
import { NodePicker, NodePickerTrigger } from "./components/node-picker";
import SaveSnapshotButton from "./components/save-snapshot-button";
import theme from "./theme";

const DockContainer = styled("div")({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: theme.mainBg,
  fontFamily: "Helvetica Neue, Calibri Light, Roboto, sans-serif",
  fontSize: "13px",

  "& .tabs": {
    height: "100%",
    width: "100%",

    "& ul": {
      margin: 0,
      padding: 0
    },

    "& .tabs__tablist": {
      display: "flex",
      listStyle: "none",
      borderBottom: `1px solid ${theme.main20}`
    },

    "& .tabs_tab-panel--selected": {
      height: "100%"
    },

    "& .tabs--selected": {
      borderBottom: `2px solid ${theme.main}`
    }
  }
});
DockContainer.displayName = "DockContainer";

const TabLabel = styled("div")({
  color: theme.white,
  textTransform: "uppercase",
  fontSize: "13px",
  padding: "16px 24px 14px",
  boxSizing: "border-box",
  userSelect: "none",

  "&:hover": {
    cursor: "pointer",
    background: theme.white05
  },

  "&:focus": {
    outline: "none"
  }
});
TabLabel.displayName = "TabLabel";

const TabPanelWrapper = styled("div")({
  width: "100%",
  height: "calc(100% - 48px)",
  boxSizing: "border-box"
});
TabPanelWrapper.displayName = "TabPanelWrapper";

const CloseButton = styled("button")({
  background: "none",
  border: "none",
  position: "absolute",
  right: 0,
  color: theme.white60,
  fontSize: "18px",

  "&:hover": {
    cursor: "pointer",
    background: theme.white05,
    color: theme.white
  },

  "&:focus": {
    outline: "none"
  }
});
CloseButton.displayName = "CloseButton";

export default function DevToolsExpanded() {
  return (
    <Subscribe to={[GlobalStateContainer]}>
      {globalState => {
        const { defaultSize, tabIndex } = globalState.state;
        const { toggleDevTools, updateBodyMargin, selectTab } = globalState;
        return (
          <CSSReset>
            <Subscribe to={[EditorStateContainer]}>
              {({
                state: { nodePicker },
                deactivatePicker,
                updateNodePickerPossition,
                nodePickerSelect
              }) => (
                <NodePicker
                  nodePicker={nodePicker}
                  onClose={deactivatePicker}
                  onMouseMove={updateNodePickerPossition}
                  onSelect={target => {
                    nodePickerSelect(target);
                    selectTab(0); // Switch to the "State" tab.
                  }}
                />
              )}
            </Subscribe>
            <Dock
              position="bottom"
              dimMode="none"
              isVisible
              defaultSize={defaultSize}
              onSizeChange={updateBodyMargin}
            >
              {() => (
                <DockContainer>
                  <CloseButton onClick={toggleDevTools}>×</CloseButton>
                  <Subscribe to={[EditorStateContainer]}>
                    {({
                      state: { nodePicker },
                      deactivatePicker,
                      activatePicker
                    }) => (
                      <NodePickerTrigger
                        onClick={
                          nodePicker.active ? deactivatePicker : activatePicker
                        }
                        isActive={nodePicker.active}
                      />
                    )}
                  </Subscribe>
                  <Subscribe to={[EditorStateContainer]}>
                    {({ saveSnapshot }) => (
                      <SaveSnapshotButton onClick={saveSnapshot}>
                        Save Snapshot
                      </SaveSnapshotButton>
                    )}
                  </Subscribe>
                  <Tabs
                    className="tabs"
                    selectedTabClassName="tabs--selected"
                    selectedTabPanelClassName="tabs_tab-panel--selected"
                    selectedIndex={tabIndex}
                    onSelect={selectTab}
                  >
                    <TabList className="tabs__tablist">
                      <Tab>
                        <TabLabel>State</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>History</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Plugins</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Schema</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Structure</TabLabel>
                      </Tab>
                      <Tab>
                        <TabLabel>Snapshots</TabLabel>
                      </Tab>
                    </TabList>
                    <TabPanel>
                      <TabPanelWrapper>
                        <StateTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <HistoryTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <PluginsTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <SchemaTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <StructureTab />
                      </TabPanelWrapper>
                    </TabPanel>
                    <TabPanel>
                      <TabPanelWrapper>
                        <SnapshotsTab />
                      </TabPanelWrapper>
                    </TabPanel>
                  </Tabs>
                </DockContainer>
              )}
            </Dock>
          </CSSReset>
        );
      }}
    </Subscribe>
  );
}
