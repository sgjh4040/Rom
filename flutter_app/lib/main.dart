import 'package:flutter/material.dart';
import 'package:flutter_body_atlas/flutter_body_atlas.dart';
import 'dart:html' as html;
import 'utils/muscle_mapper.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: BodyAtlasRenderer(),
    );
  }
}

class BodyAtlasRenderer extends StatefulWidget {
  const BodyAtlasRenderer({super.key});

  @override
  State<BodyAtlasRenderer> createState() => _BodyAtlasRendererState();
}

class _BodyAtlasRendererState extends State<BodyAtlasRenderer> {
  final _resolver = const MuscleResolver();
  List<MuscleInfo> _selectedMuscles = [];
  Color _highlightColor = Colors.redAccent;
  
  // 상태 변경 감지를 위한 백업 필드
  String _lastMusclesStr = "";
  String _lastColorStr = "";

  @override
  void initState() {
    super.initState();
    _parseUrlParams();
    html.window.onMessage.listen((event) {
      if (event.data is Map) {
        _updateStateFromMap(event.data as Map);
      }
    });
  }

  void _parseUrlParams() {
    final uri = Uri.parse(html.window.location.href);
    _updateStateFromMap(uri.queryParameters);
  }

  void _updateStateFromMap(dynamic data) {
    if (data == null) return;
    try {
      final mapData = Map<String, dynamic>.from(data as Map);
      
      final incomingMuscles = mapData['muscles']?.toString() ?? _lastMusclesStr;
      final incomingColor = mapData['color']?.toString() ?? _lastColorStr;

      // 데이터가 실제로 변경된 경우에만 setState 호출하여 리렌더링 및 네트워크 요청 방지
      if (incomingMuscles != _lastMusclesStr || incomingColor != _lastColorStr) {
        setState(() {
          _lastMusclesStr = incomingMuscles;
          _lastColorStr = incomingColor;
          
          final list = incomingMuscles.split(',').map((e) => e.trim()).toList();
          _selectedMuscles = MuscleMapper.getTargetMuscles(list);
          
          if (incomingColor.isNotEmpty) {
            _highlightColor = _parseColor(incomingColor);
          }
        });
      }
    } catch (e) {
      debugPrint('Error updating state from map: $e');
    }
  }

  Color _parseColor(String colorStr) {
    try {
      if (colorStr.startsWith('#')) {
        final hex = colorStr.replaceAll('#', '');
        return Color(int.parse('FF$hex', radix: 16));
      }
      switch (colorStr.toLowerCase()) {
        case 'yellow': return Colors.orangeAccent;
        case 'blue': return Colors.blue;
        case 'red': return Colors.redAccent;
        case 'green': return Colors.green;
      }
    } catch (e) {
      debugPrint('Color parse error: $e');
    }
    return Colors.redAccent;
  }



  @override
  Widget build(BuildContext context) {
    final needsBackView = _selectedMuscles.any((m) =>
        m.group == MuscleGroup.back ||
        m.group == MuscleGroup.glutes ||
        m.group == MuscleGroup.hamstrings);

    final viewAssest = needsBackView ? AtlasAsset.musclesBack : AtlasAsset.musclesFront;
    final colorMap = {
      for (var m in _selectedMuscles) m: _highlightColor,
    };

    return Scaffold(
      backgroundColor: Colors.transparent, // Important for iframe blending
      body: Center(
        child: BodyAtlasView<MuscleInfo>(
          view: viewAssest,
          resolver: _resolver,
          colorMapping: colorMap,
        ),
      ),
    );
  }
}
