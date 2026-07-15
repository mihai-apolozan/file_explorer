import { useFileSystem } from "./hooks/useFileSystem"
import { Breadcrumb } from "./components/Breadcrumb"
import { FileList } from "./components/FileList"
import { Layout } from "./components/Layout";
import { FolderTree } from "./components/FolderTree";
import { useEffect, useState } from "react";
import { FilePreview } from "./components/FilePreview";
import type { FileEntry } from "./types";
import { ContextMenu } from "./components/ContextMenu";

export default function App() {
  const { currentPath, entries, loading, error, navigate, refresh, goBack } = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const closeFile = () => setSelectedFile(null);
  const [contextMenu, setContextMenu] = useState<{ entry: FileEntry, x: number, y: number} | null>(null);

  const contextHandler = (entry: FileEntry, x: number, y: number) => setContextMenu({entry, x, y});


  useEffect(() => { closeFile() }, [currentPath]);


  useEffect(() => {
    const close = () => setContextMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [])
  return (
    <div>
      <div style = {{display:'flex'}}>
        <button style = {{width:'50px'}}
        onClick = {() => {navigate(currentPath.substring(0, currentPath.lastIndexOf('/')) || '/')}}>Up</button>
        <button style = {{width:'50px'}}
        onClick = {() => {goBack()}}>back</button>
        
        <h1>File Explorer</h1>
      </div>
      <Breadcrumb path = {currentPath} onNavigate={navigate} />
      <Layout sidebar = {<FolderTree currentPath = {currentPath} onNavigate={navigate} onClose={closeFile}/>}>
        {selectedFile ? 
          <FilePreview
          path = {selectedFile}
          onClose={closeFile}
          />
          :
          <FileList
          currentPath={currentPath}
          entries = {entries}
          loading = {loading}
          error = {error}
          onNavigate={navigate}
          onFileClick={(path:string) => setSelectedFile(path)}
          onRightClick={contextHandler}
          onRefresh={refresh}
          />
        }
      </Layout>
      { contextMenu && <ContextMenu entry = {contextMenu.entry} x = {contextMenu.x} y = {contextMenu.y} onRefresh={refresh}/> }
    </div>
  );
}
