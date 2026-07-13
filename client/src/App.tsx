import { useFileSystem } from "./hooks/useFileSystem"
import { Breadcrumb } from "./components/Breadcrumb"
import { FileList } from "./components/FileList"
import { Layout } from "./components/Layout";
import { FolderTree } from "./components/FolderTree";
import { useEffect, useState } from "react";
import { FilePreview } from "./components/FilePreview";

export default function App() {
  const { currentPath, entries, loading, error, navigate, goBack } = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const closeFile = () => setSelectedFile(null);

  useEffect(() => { closeFile() }, [currentPath]);

  return (
    <div>
      <div style = {{display:'flex'}}>
        <button style = {{width:'50px'}}
        onClick = {() => {navigate(currentPath.substring(0, currentPath.lastIndexOf('/')) || '/')}}/>
        <button style = {{width:'50px'}}
        onClick = {() => {goBack()}}/>
        
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
          entries = {entries}
          loading = {loading}
          error = {error}
          onNavigate={navigate}
          onFileClick={(path:string) => setSelectedFile(path)}
          />
        }
      </Layout>
    </div>
  );
}
