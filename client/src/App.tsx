import { useFileSystem } from "./hooks/useFileSystem"
import { Breadcrumb } from "./components/Breadcrumb"
import { FileList } from "./components/FileList"
import { Layout } from "./components/Layout";
import { FolderTree } from "./components/FolderTree";

export default function App() {
  const { currentPath, entries, loading, error, navigate } = useFileSystem();

  return (
    <div>
      <div style = {{display:'flex'}}>
        <button style = {{width:'50px'}}onClick = {() => {navigate(currentPath.substring(0, currentPath.lastIndexOf('/')) || '/')}}/>
        <h1>File Explorer</h1>
      </div>
      <Breadcrumb path = {currentPath} onNavigate={navigate} />
      <Layout sidebar = {<FolderTree currentPath = {currentPath} onNavigate={navigate}/>}>
        <FileList
        entries = {entries}
        loading = {loading}
        error = {error}
        onNavigate={navigate}
        />
      </Layout>
    </div>
  )
}
