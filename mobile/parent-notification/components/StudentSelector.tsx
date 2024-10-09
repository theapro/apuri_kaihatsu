import React from 'react'
import {Student} from '@/constants/types'
import {ThemedView} from '@/components/ThemedView'
import {ThemedText} from '@/components/ThemedText'
import {Pressable, StyleSheet} from 'react-native'

interface StudentSelectorProps {
  students: Student[] | null;
  activeStudent: Student | undefined;
  setActiveStudent: (student: Student) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = React.memo(
  ({students, activeStudent, setActiveStudent}) => {
    return (
      <ThemedView style={{padding: 10}}>
        <ThemedView style={styles.reason}>
          {students && students.map((student) => (
            <Pressable
              key={student.id}
              style={
                activeStudent?.given_name === student.given_name
                  ? styles.activeStudent
                  : styles.button
              }
              onPress={() => setActiveStudent(student)}
            >
              <ThemedText
                type="smaller"
                style={
                  activeStudent?.given_name === student.given_name
                    ? styles.activeStudentText
                    : styles.buttonText
                }
              >
                {student.given_name}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  activeStudent: {
    padding: 8,
    flex: 1,
    borderRadius: 2,
    backgroundColor: "#059669",
  },
  button: {
    padding: 8,
    flex: 1,
    borderRadius: 4,
  },
  reason: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "grey",
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
  activeStudentText: {
    textAlign: "center",
    color: "#FFF",
  },
});
