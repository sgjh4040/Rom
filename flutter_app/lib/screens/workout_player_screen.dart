import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_body_atlas/flutter_body_atlas.dart';
import '../models/ces_exercise.dart';
import '../utils/muscle_mapper.dart';
import '../widgets/phase_badge.dart';

class WorkoutPlayerScreen extends StatefulWidget {
  final CesRoutine routine;
  const WorkoutPlayerScreen({Key? key, required this.routine}) : super(key: key);

  @override
  State<WorkoutPlayerScreen> createState() => _WorkoutPlayerScreenState();
}

class _WorkoutPlayerScreenState extends State<WorkoutPlayerScreen> {
  int _currentStepIndex = 0;
  late int _countdown;
  Timer? _timer;
  bool _isPaused = false;
  final MuscleResolver _resolver = const MuscleResolver();

  @override
  void initState() {
    super.initState();
    _startStep(_currentStepIndex);
  }

  void _startStep(int index) {
    if (index >= widget.routine.exercises.length) return;
    setState(() {
      _currentStepIndex = index;
      _countdown = widget.routine.exercises[index].durationSeconds;
    });
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_isPaused) return;
      setState(() {
        if (_countdown > 0) {
          _countdown--;
        } else {
          _timer?.cancel();
          if (_currentStepIndex + 1 < widget.routine.exercises.length) {
            _startStep(_currentStepIndex + 1);
          }
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_currentStepIndex >= widget.routine.exercises.length) {
      return Scaffold(
        appBar: AppBar(title: const Text('Workout Complete')),
        body: const Center(child: Text('Done!')),
      );
    }

    final curEx = widget.routine.exercises[_currentStepIndex];
    final hlColor = MuscleMapper.getHighlightColor(curEx.cesPhase);
    final selectedMuscles = MuscleMapper.getTargetMuscles(curEx.targetMuscleIds);

    final needsBackView = selectedMuscles.any((m) =>
        m.group == MuscleGroup.back || m.group == MuscleGroup.glutes || m.group == MuscleGroup.hamstrings);

    final viewAssest = needsBackView ? AtlasAsset.musclesBack : AtlasAsset.musclesFront;
    final colorMap = { for (var m in selectedMuscles) m: hlColor };

    return Scaffold(
      backgroundColor: const Color(0xFF1C3F6F), // Dark premium background
      body: Row(
        children: [
          // Left Sidebar (like MedicalMotion user's request)
          Container(
            width: 350,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF1C3F6F), Color(0xFF0D1B2E)],
                begin: Alignment.topLeft, end: Alignment.bottomRight,
              ),
              border: Border(right: BorderSide(color: Colors.white10)),
            ),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                const Text('● medicalmotion', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 30),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.all(16),
                    child: BodyAtlasView<MuscleInfo>(view: viewAssest, resolver: _resolver, colorMapping: colorMap),
                  ),
                ),
                const SizedBox(height: 30),
                const Text('TOTAL TIME', style: TextStyle(color: Colors.white54, fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 1)),
                Text(
                  '${(_countdown ~/ 60).toString().padLeft(2, '0')}:${(_countdown % 60).toString().padLeft(2, '0')}',
                  style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: _countdown <= 3 ? Colors.redAccent : Colors.white),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => setState(() => _isPaused = !_isPaused),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: _isPaused ? Colors.green : const Color(0xFF3B82F6),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                    child: Text(_isPaused ? 'Resume' : 'Pause', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 30),
                const Text('EXERCISE', style: TextStyle(color: Colors.white54, fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 1)),
                Text('Step ${_currentStepIndex + 1} / ${widget.routine.exercises.length}', style: const TextStyle(color: Colors.greenAccent, fontSize: 16)),
                const SizedBox(height: 30),
                const Text('SYSTEMS', style: TextStyle(color: Colors.white54, fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 1)),
                const Text('FASCIA SYSTEM\nNERVOUS SYSTEMS', style: TextStyle(color: Colors.white70, fontSize: 14)),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    PhaseBadge(phase: 'INHIBIT', currentPhase: curEx.cesPhase),
                    PhaseBadge(phase: 'LENGTHEN', currentPhase: curEx.cesPhase),
                    PhaseBadge(phase: 'ACTIVATE', currentPhase: curEx.cesPhase),
                    PhaseBadge(phase: 'INTEGRATE', currentPhase: curEx.cesPhase),
                  ],
                )
              ],
            ),
          ),
          // Main Area: Controller & Video Placeholder
          Expanded(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(curEx.cesPhase, style: TextStyle(color: hlColor, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Text(curEx.exerciseName, style: const TextStyle(color: Color(0xFF1C3F6F), fontSize: 36, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 40),
                  Expanded(
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
                      child: const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.movie_creation_outlined, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text('Video Placeholder', style: TextStyle(color: Colors.grey, fontSize: 18))
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
