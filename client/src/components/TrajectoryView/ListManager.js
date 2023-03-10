import { arrayMoveImmutable as move } from 'array-move';
// import FlipMove from 'react-flip-move';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from 'react';

const grid = 5;

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightgrey" : "inherit",
  padding: grid,
  width: 250
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "white" : "inherit",
  // color: isDragging ? 'white': 'inherit',
  border: isDragging ? '1px dashed red' : '1px solid black',

  // styles we need to apply on draggables
  ...draggableStyle
});

export default function ListManager({
  renderItem,
  onNewItem,
  onUpdateItems,
  items,
  reordable = true,
  messageAddItem,
}) {
  const [disableFlipMove, setDisableFlipMove] = useState(false);
  const handleAddItem = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onNewItem();
  }
  const onDragEnd = (result) => {

    if (!result.destination) {
      return;
    }

    const newItems = move(
      items,
      result.source.index,
      result.destination.index
    );
    setDisableFlipMove(true);
    setTimeout(() => setDisableFlipMove(false), 100)
    onUpdateItems(newItems);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="ListManager"
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <ul style={{position: 'relative'}}>
              {/* <FlipMove
                typeName={null}
                disableAllAnimations={disableFlipMove}
              > */}
                {
                  items.map((itemData, itemIndex) => {
                    const handleUp = (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onUpdateItems(move(items, itemIndex, itemIndex - 1));
                    }
                    const handleDown = (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onUpdateItems(move(items, itemIndex, itemIndex + 1));
                    }
                    const handleDelete = (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onUpdateItems(items.filter((_i, i) => i !== itemIndex));
                    }
                    if (reordable) {
                      return (
                        <Draggable key={itemData.id} draggableId={itemData.id} index={itemIndex}>
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                              className="list-item"
                            >
                              <div className="item-form-container">
                                {renderItem(itemData, itemIndex)}
                              </div>
                              <div className="item-actions-container">
                                <button onClick={handleUp} disabled={itemIndex === 0}>↑</button>
                                <button onClick={handleDown} disabled={itemIndex > items.length - 2}>↓</button>
                                <button onClick={handleDelete}>🗑</button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      )
                    }
                    return (
                      <li key={itemData.id || itemIndex}>
                        <div className="item-form-container">
                          {renderItem(itemData, itemIndex)}
                        </div>
                        <div className="item-actions-container">
                          {/* <button onClick={handleUp} disabled={itemIndex === 0}>↑</button> */}
                          {/* <button onClick={handleDown} disabled={itemIndex > items.length - 2}>↓</button> */}
                          <button onClick={handleDelete}>🗑</button>
                        </div>
                      </li>
                    )
                  })
                }
                {provided.placeholder}
              {/* </FlipMove> */}
            </ul>
            <button onClick={handleAddItem}>{messageAddItem || 'add item'}</button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}