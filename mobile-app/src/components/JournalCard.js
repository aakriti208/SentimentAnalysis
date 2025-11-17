import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

const JournalCard = ({ entry, onEdit, onDelete, onPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef(null);

  const handleMenuPress = () => {
    if (menuButtonRef.current) {
      menuButtonRef.current.measure((fx, fy, width, height, px, py) => {
        setMenuPosition({
          top: py + height,
          right: 20,
        });
        setMenuVisible(true);
      });
    }
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit(entry);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    onDelete(entry);
  };

  const formattedDate = entry.date
    ? format(parseISO(entry.date), 'MMM d, yyyy')
    : '';

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(entry)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.mainContent}>
            <Text style={styles.title} numberOfLines={1}>
              {entry.title || 'Untitled'}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <TouchableOpacity
            ref={menuButtonRef}
            style={styles.menuButton}
            onPress={handleMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menu, { top: menuPosition.top, right: menuPosition.right }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={18} color="#1a1a1a" />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  menuButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E8ECF2',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  deleteText: {
    color: '#EF4444',
  },
});

export default JournalCard;
