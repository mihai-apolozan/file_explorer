import { useFileSystem } from "./hooks/useFileSystem"
import { Breadcrumb } from "./components/Breadcrumb"
import { FileList } from "./components/FileList"
import { Layout } from "./components/Layout";
import { FolderTree } from "./components/FolderTree";
import { useEffect, useState } from "react";
import { FilePreview } from "./components/FilePreview";
import type { FileEntry } from "./types";
import { ContextMenu } from "./components/ContextMenu";
import { searchServer } from "./api/files";
import { useDebounce } from "./hooks/useDebounce";
import './App.css'
import { ArrowLeft, ArrowUp, X } from "lucide-react";

export default function App() {
  const { currentPath, entries, loading, error, navigate, refresh, goBack} = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const closeFile = () => setSelectedFile(null);
  const [contextMenu, setContextMenu] = useState<{ entry: FileEntry, x: number, y: number} | null>(null);

  const contextHandler = (entry: FileEntry, x: number, y: number) => setContextMenu({entry, x, y});

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FileEntry[] | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const noResults = searchResults?.length === 0;
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const asyncSearch = async () => {const results = await searchServer(debouncedQuery, currentPath); setSearchResults(results);}
    
    if(debouncedQuery.length > 0) asyncSearch();
    else {
      setSearchResults(null);
    }
  }, [debouncedQuery, currentPath])

  useEffect(() => { closeFile(); setSearchResults(null); }, [currentPath]);


  useEffect(() => {
    const close = () => setContextMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [])


  return (
    <div>
      <div className = 'toolbar'>
        <button onClick = {() => {goBack()}}><ArrowLeft/></button>
        <button onClick = {() => {navigate(currentPath.substring(0, currentPath.lastIndexOf('/')) || '/')}}><ArrowUp/></button>
        
        
        <h1>File Explorer</h1>
        <input
        value = {searchQuery}
        onChange = {(e) => setSearchQuery(e.target.value)}
        onKeyDown = {(e) => { if (e.key === 'Enter' && searchQuery.length > 0) searchServer(searchQuery, currentPath).then(setSearchResults); }}
        ></input>
        <button onClick = {() => {setSearchQuery(''); setSearchResults(null);}}><X/></button>
      </div>
      <Breadcrumb path = {currentPath} onNavigate={navigate}/>
      <Layout sidebar = 
        {<FolderTree currentPath = {currentPath} onNavigate={navigate} onClose={closeFile} token = {refreshToken}/>}>
        {selectedFile ?
          <FilePreview
          entry = {selectedFile}
          onClose={closeFile}
          />
            : searchResults ?
          (noResults ?
          <div className="empty-state">No files match your search</div>
            :
          <FileList
          currentPath={currentPath}
          entries={searchResults}
          loading={false}
          error={null}
          onNavigate={navigate}
          onFileClick={(entry: FileEntry) => setSelectedFile(entry)}
          onRightClick={contextHandler}
          onRefresh={() => {refresh(); setRefreshToken(prev => prev + 1)}}
          searchMode={true}
          />)
          :
          <FileList
          currentPath={currentPath}
          entries = {entries}
          loading = {loading}
          error = {error}
          onNavigate={navigate}
          onFileClick={(entry: FileEntry) => setSelectedFile(entry)}
          onRightClick={contextHandler}
          onRefresh={() => {refresh(); setRefreshToken(prev => prev + 1)}}
          searchMode={false}
          />
        }
      </Layout>
      { contextMenu && <ContextMenu entry = {contextMenu.entry} x = {contextMenu.x} y = {contextMenu.y} onRefresh={() => {refresh(); setRefreshToken(prev => prev + 1)}}/> }
    </div>
  );
}
