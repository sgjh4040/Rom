// lib/models/ces_exercise.dart
class CesExerciseStep {
  final int step;
  final String exerciseName;
  final String videoUrl;
  final int durationSeconds;
  final String cesPhase; // 'Inhibit', 'Lengthen', 'Activate', 'Integrate'
  final List<String> targetMuscleIds;

  CesExerciseStep({
    required this.step,
    required this.exerciseName,
    required this.videoUrl,
    required this.durationSeconds,
    required this.cesPhase,
    required this.targetMuscleIds,
  });

  factory CesExerciseStep.fromJson(Map<String, dynamic> json) {
    return CesExerciseStep(
      step: json['step'],
      exerciseName: json['exerciseName'],
      videoUrl: json['videoUrl'],
      durationSeconds: json['durationSeconds'],
      cesPhase: json['cesPhase'],
      targetMuscleIds: List<String>.from(json['targetSvgIds'] ?? []),
    );
  }
}

class CesRoutine {
  final String routineId;
  final int totalDurationSeconds;
  final List<CesExerciseStep> exercises;

  CesRoutine({
    required this.routineId,
    required this.totalDurationSeconds,
    required this.exercises,
  });

  factory CesRoutine.fromJson(Map<String, dynamic> json) {
    return CesRoutine(
      routineId: json['routineId'],
      totalDurationSeconds: json['totalDurationSeconds'],
      exercises: (json['exercises'] as List)
          .map((e) => CesExerciseStep.fromJson(e))
          .toList(),
    );
  }
}
