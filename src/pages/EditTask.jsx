import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import axios from "axios";
import { useCookies } from "react-cookie";
import { url } from "../const";
import { useNavigate, useParams } from "react-router-dom";


export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState("");
  // ここから4
  const [limit, setLimit] = useState("");
  // ここまで
  const [detail, setDetail] = useState("");
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const handleTitleChange = (e) => setTitle(e.target.value);
  // ここから4
  const handleLimitChange = (e) => setLimit(e.target.value);
  // ここまで
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === "done");
  const onUpdateTask = () => {
    console.log(isDone)
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      // ここから4
      limit: new Date(limit).toISOString(),
      // ここまで
    }

    axios.put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
      headers: {
        authorization: `Bearer ${cookies.token}`
      }
    })
    .then((res) => {
      console.log(res.data)
      navigate("/");
    })
    .catch((err) => {
      setErrorMessage(`更新に失敗しました。${err}`);
    })
  }

  const onDeleteTask = () => {
    axios.delete(`${url}/lists/${listId}/tasks/${taskId}`, {
      headers: {
        authorization: `Bearer ${cookies.token}`
      }
    })
    .then(() => {
      navigate("/");
    })
    .catch((err) => {
      setErrorMessage(`削除に失敗しました。${err}`);
    })
  }

  useEffect(() => {
    axios.get(`${url}/lists/${listId}/tasks/${taskId}`, {
      headers: {
        authorization: `Bearer ${cookies.token}`
      }
    })
    .then((res) => {
      const task = res.data
      setTitle(task.title)
      setDetail(task.detail)
      setIsDone(task.done)
      // ここから4
      const date = new Date(task.limit);
      date.setHours(date.getHours() + 9);
      setLimit(date.toISOString().slice(0, 16).replace('Z', ''));
      // ここまで
    })
    .catch((err) => {
      setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
    })
  }, [])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label><br/>
          <input type="text" onChange={handleTitleChange} className="edit-task-title" value={title}/><br/>
          {/*ここから4*/}
          <label>期限</label><br/>
          <input type="datetime-local" value={limit} onChange={handleLimitChange} className="edit-task-limit" /><br/>
          {/*ここまで*/}
          <label>詳細</label><br/>
          <textarea type="text" onChange={handleDetailChange} className="edit-task-detail" value={detail}/><br/>
          <div>
            <input type="radio" id="todo" name="status" value="todo" onChange={handleIsDoneChange}
                   checked={isDone === false ? "checked" : ""}/>未完了
            <input type="radio" id="done" name="status" value="done" onChange={handleIsDoneChange}
                   checked={isDone === true ? "checked" : ""}/>完了
          </div>
          <button type="button" className="delete-task-button" onClick={onDeleteTask}>削除</button>
          <button type="button" className="edit-task-button" onClick={onUpdateTask}>更新</button>
        </form>
      </main>
    </div>
  )
}