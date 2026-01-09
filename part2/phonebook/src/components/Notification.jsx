const Notification = ({ notification }) => {
  
  if (notification) {
    const notificationStyle = {
      color: notification.type === 'error' ? 'red' : 'green',
      fontSize: '24px',
      fontStyle: 'italic',
      fontWeight: '550',
      textAlign: 'center',
      margin: '10px',
      background: 'lightgrey',
      borderRadius: '5px',
      borderStyle: 'solid',
    }
    return (
      <div style={notificationStyle}>
        <p>
          {notification.message}
        </p>
      </div>
    )
  }
  return null;
} 

export default Notification;