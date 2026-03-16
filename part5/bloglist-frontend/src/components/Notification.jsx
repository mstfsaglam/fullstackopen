const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const notificationStyle = {
    color: notification.type === 'error' ? 'red': 'green',
    fontSize: '20px',
    fontWeight: '500',
    textAlign: 'left',
    padding: '10px',
    margin: '10px 0',
    background: 'lightgrey',
    border: '4px',
    borderRadius: '4px',
    borderStyle: 'solid',
  }

  return (
    <div style={notificationStyle}>
      { notification.message }
    </div>
  )
}

export default Notification