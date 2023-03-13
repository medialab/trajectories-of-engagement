import { arrayMoveImmutable as move } from 'array-move';
// import FlipMove from 'react-flip-move';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from 'react';
import { translate } from '../../utils';

const grid = 5;

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightgrey" : "inherit",
  padding: 0,//grid,
  // width: 250
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

const ListItem = ({
  lang,
  itemData,
  itemIndex,
  renderItem,
  renderMinifiedHeader,
  onUp,
  onDown,
  onDelete,
  items,
  isMinified
}) => {

  const [isEdited, setIsEdited] = useState(false);
  useEffect(() => {
    setIsEdited(false);
  }, [isMinified]);

  if (isMinified && !isEdited) {
    return (
      <Draggable key={itemData.id} draggableId={itemData.id} index={itemIndex}>
      {(provided, snapshot) => (
         <div 
         ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}
             style={getItemStyle(
               snapshot.isDragging,
               provided.draggableProps.style
             )}
         className="list-item minified">
           <div>
             {renderMinifiedHeader(itemData)}
           </div>
           <div>
             <button onClick={() => setIsEdited(!isEdited)}>
               {'✎'}
             </button>
           </div>
         </div>
      )}
      </Draggable>
     
    )
  }
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
            {
            isMinified && isEdited ?
              <button onClick={() => setIsEdited(false)}>
                {translate('fold', lang)}
              </button>
              : null
            }
            {
              !isMinified || isEdited ?
              <>
                <button onClick={onUp} disabled={itemIndex === 0 || items.length === 1}>↑</button>
                <button onClick={onDown} disabled={itemIndex > items.length - 2 || items.length === 1}>↓</button>
                <button onClick={onDelete}>🗑</button>
              </>
              : null
            }
            
          </div>
        </li>
      )}
    </Draggable>
  )
}

export default function ListManager({
  renderItem,
  onNewItem,
  onUpdateItems,
  renderMinifiedHeader,
  items,
  messageAddItem,
  isMinified,
  lang
}) {
  // const [disableFlipMove, setDisableFlipMove] = useState(false);
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
    // setDisableFlipMove(true);
    // setTimeout(() => setDisableFlipMove(false), 100)
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
            <ul style={{ position: 'relative' }}>
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
                  return (
                    <ListItem
                      key={itemData.id}
                      {...{
                        itemData,
                        itemIndex,
                        renderItem,
                        renderMinifiedHeader,
                        onUp: handleUp,
                        onDown: handleDown,
                        onDelete: handleDelete,
                        items,
                        isMinified,
                        lang,
                      }}
                    />
                  )

                })
              }
              {provided.placeholder}
              {/* </FlipMove> */}
            </ul>
            <button
              onClick={handleAddItem}
              className="add-item-btn"
            >
              {messageAddItem || 'add item'}
            </button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}