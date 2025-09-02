import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const AutoComplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [isOpen, setIsOpen] = useState(false);

  const timerId = useRef<number>();

  useEffect(() => {
    clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      if (searchText.trim() === '') {
        setFilteredPeople(people);
      } else {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(searchText.toLowerCase()),
          ),
        );
      }
    }, delay);

    return () => clearTimeout(timerId.current);
  }, [searchText, people, delay]);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchText}
          onChange={event => {
            setSearchText(event.target.value);
            onSelected(null);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (searchText === '') {
              setFilteredPeople(people);
            }
          }}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setSearchText(person.name);
                    onSelected(person);
                    setIsOpen(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="dropdown-item has-text-danger"
                data-cy="no-suggestions-message"
              >
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
